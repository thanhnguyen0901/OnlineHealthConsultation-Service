/**
 * Tests for the refresh-token grace-window logic introduced to prevent
 * false-positive TOKEN_REUSE_DETECTED errors on F5-reload / multi-tab races.
 *
 * Scenarios covered:
 *  1. Token reuse within grace window  → 409 TOKEN_ROTATED (no session wipe)
 *  2. Token reuse after grace window   → 401 TOKEN_REUSE_DETECTED + all sessions revoked
 *  3. Token revoked with rotatedAt=NULL (logout/admin) → security path regardless of age
 *  4. Normal rotation (not revoked)    → succeeds, sets rotatedAt on the old session
 */

import { AppError } from '../src/middlewares/error.middleware';

// ---------------------------------------------------------------------------
// Mock heavy dependencies before importing the service
// ---------------------------------------------------------------------------

// Mock prisma singleton
jest.mock('../src/config/db', () => ({
  __esModule: true,
  default: {
    userSession: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

// Mock JWT helpers
jest.mock('../src/utils/jwt', () => ({
  verifyRefreshToken: jest.fn(),
  signAccessToken: jest.fn().mockReturnValue('new-access-token'),
  signRefreshToken: jest.fn().mockReturnValue('new-refresh-token'),
}));

// Mock password helpers (not used in refresh but imported by the module)
jest.mock('../src/utils/password', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));

// Mock session cleanup (fire-and-forget; irrelevant for these tests)
jest.mock('../src/utils/sessionCleanup', () => ({
  cleanupUserSessions: jest.fn().mockResolvedValue(undefined),
}));

// Mock id generator
jest.mock('../src/utils/id', () => ({
  newId: jest.fn().mockReturnValue('new-session-id'),
}));

// ---------------------------------------------------------------------------
// Import after mocks are registered
// ---------------------------------------------------------------------------
import prisma from '../src/config/db';
import { verifyRefreshToken } from '../src/utils/jwt';
import { AuthService } from '../src/services/auth.service';
import env from '../src/config/env';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockVerifyRefreshToken = verifyRefreshToken as jest.Mock;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal UserSession-shaped object. */
function makeSession(overrides: {
  revokedAt?: Date | null;
  rotatedAt?: Date | null;
  expiresAt?: Date;
} = {}) {
  return {
    id: 'session-1',
    userId: 'user-1',
    refreshTokenHash: 'hash-abc',
    expiresAt: overrides.expiresAt ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    revokedAt: overrides.revokedAt ?? null,
    rotatedAt: overrides.rotatedAt ?? null,
    lastUsedAt: new Date(),
    createdAt: new Date(),
    userAgent: null,
    ipAddress: null,
  };
}

/** Build a minimal User object returned by prisma.user.findUnique in the rotate path. */
const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'PATIENT' as const,
  isActive: true,
  patientProfile: null,
  doctorProfile: null,
};

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('AuthService.refresh — grace-window logic', () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService();

    // Default: JWT verification succeeds
    mockVerifyRefreshToken.mockReturnValue({ id: 'user-1', role: 'PATIENT' });
  });

  // -------------------------------------------------------------------------
  // 1. Reuse within grace window
  // -------------------------------------------------------------------------
  describe('when the revoked token was rotated within the grace window', () => {
    it('throws 409 TOKEN_ROTATED', async () => {
      // rotatedAt = 1 second ago (well within the 10 s default grace window)
      const rotatedAt = new Date(Date.now() - 1_000);
      (mockPrisma.userSession.findUnique as jest.Mock).mockResolvedValue(
        makeSession({ revokedAt: rotatedAt, rotatedAt })
      );

      await expect(service.refresh('some-token')).rejects.toMatchObject({
        statusCode: 409,
        code: 'TOKEN_ROTATED',
      });
    });

    it('does NOT call updateMany (bulk session wipe must not happen)', async () => {
      const rotatedAt = new Date(Date.now() - 500);
      (mockPrisma.userSession.findUnique as jest.Mock).mockResolvedValue(
        makeSession({ revokedAt: rotatedAt, rotatedAt })
      );

      await expect(service.refresh('some-token')).rejects.toBeInstanceOf(AppError);

      expect(mockPrisma.userSession.updateMany).not.toHaveBeenCalled();
    });

    it('throws AppError (not a generic Error)', async () => {
      const rotatedAt = new Date(Date.now() - 2_000);
      (mockPrisma.userSession.findUnique as jest.Mock).mockResolvedValue(
        makeSession({ revokedAt: rotatedAt, rotatedAt })
      );

      await expect(service.refresh('some-token')).rejects.toBeInstanceOf(AppError);
    });

    it('uses the configured grace window value from env', async () => {
      // Simulate the boundary: rotatedAt exactly at the edge of the grace window.
      // REFRESH_GRACE_WINDOW_MS default is 10_000 ms.
      const graceWindowMs = env.REFRESH_GRACE_WINDOW_MS;
      const rotatedAtEdge = new Date(Date.now() - graceWindowMs + 100); // 100ms inside window
      (mockPrisma.userSession.findUnique as jest.Mock).mockResolvedValue(
        makeSession({ revokedAt: rotatedAtEdge, rotatedAt: rotatedAtEdge })
      );

      await expect(service.refresh('some-token')).rejects.toMatchObject({
        statusCode: 409,
        code: 'TOKEN_ROTATED',
      });
    });
  });

  // -------------------------------------------------------------------------
  // 2. Reuse outside grace window
  // -------------------------------------------------------------------------
  describe('when the revoked token was rotated outside the grace window', () => {
    it('throws 401 TOKEN_REUSE_DETECTED', async () => {
      // rotatedAt = 1 hour ago (well outside the 10 s window)
      const oldRotatedAt = new Date(Date.now() - 60 * 60 * 1000);
      (mockPrisma.userSession.findUnique as jest.Mock).mockResolvedValue(
        makeSession({ revokedAt: oldRotatedAt, rotatedAt: oldRotatedAt })
      );
      (mockPrisma.userSession.update as jest.Mock).mockResolvedValue({});

      await expect(service.refresh('some-token')).rejects.toMatchObject({
        statusCode: 401,
        code: 'TOKEN_REUSE_DETECTED',
      });
    });

    it('revokes only the specific session (update by id), NOT all user sessions', async () => {
      const oldRotatedAt = new Date(Date.now() - 30 * 60 * 1000);
      (mockPrisma.userSession.findUnique as jest.Mock).mockResolvedValue(
        makeSession({ revokedAt: oldRotatedAt, rotatedAt: oldRotatedAt })
      );
      (mockPrisma.userSession.update as jest.Mock).mockResolvedValue({});

      await expect(service.refresh('some-token')).rejects.toBeInstanceOf(AppError);

      // Must revoke only the presented session by its id — not all user sessions.
      expect(mockPrisma.userSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'session-1' },
          data: expect.objectContaining({ revokedAt: expect.any(Date) }),
        })
      );
      // updateMany (revokeAllUserSessions) must NOT be called.
      expect(mockPrisma.userSession.updateMany).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 3. Revoked with rotatedAt=NULL (logout / admin wipe / unknown reason)
  // -------------------------------------------------------------------------
  describe('when the token is revoked but rotatedAt is NULL', () => {
    it('throws 401 TOKEN_REUSE_DETECTED and revokes only the specific session', async () => {
      // revokedAt is set but rotatedAt is null → not a rotation race (e.g. logout/admin);
      // the presented token is already revoked so we ensure the session stays revoked
      // and return TOKEN_REUSE_DETECTED without touching other sessions.
      const revokedAt = new Date(Date.now() - 5_000); // 5 s ago — inside grace window period,
      // but rotatedAt is null so it must go through the security branch.
      (mockPrisma.userSession.findUnique as jest.Mock).mockResolvedValue(
        makeSession({ revokedAt, rotatedAt: null })
      );
      (mockPrisma.userSession.update as jest.Mock).mockResolvedValue({});

      await expect(service.refresh('some-token')).rejects.toMatchObject({
        statusCode: 401,
        code: 'TOKEN_REUSE_DETECTED',
      });

      // Only the specific session is updated — not all user sessions.
      expect(mockPrisma.userSession.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'session-1' } })
      );
      expect(mockPrisma.userSession.updateMany).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 4. Normal happy-path rotation — rotatedAt is written to the old session
  // -------------------------------------------------------------------------
  describe('when the token is valid (not revoked)', () => {
    beforeEach(() => {
      (mockPrisma.userSession.findUnique as jest.Mock).mockResolvedValue(makeSession());
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      // $transaction: execute the array of Prisma calls simulation
      (mockPrisma.$transaction as jest.Mock).mockImplementation(
        async (ops: Array<Promise<unknown>>) => Promise.all(ops)
      );
      (mockPrisma.userSession.update as jest.Mock).mockResolvedValue({});
      (mockPrisma.userSession.create as jest.Mock).mockResolvedValue({});
    });

    it('returns accessToken, refreshToken and user', async () => {
      const result = await service.refresh('valid-token');
      expect(result).toMatchObject({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: expect.objectContaining({ id: 'user-1' }),
      });
    });

    it('sets rotatedAt on the old session in the rotation transaction', async () => {
      await service.refresh('valid-token');

      // The $transaction array must contain an update that sets rotatedAt
      const txCall = (mockPrisma.$transaction as jest.Mock).mock.calls[0][0];
      // txCall is an array of unresolved Prisma promises; verify the update mock
      // was called with rotatedAt among the data fields.
      expect(mockPrisma.userSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'session-1' },
          data: expect.objectContaining({
            revokedAt: expect.any(Date),
            rotatedAt: expect.any(Date),
          }),
        })
      );
    });

    it('sets revokedAt and rotatedAt to the same timestamp on rotation', async () => {
      await service.refresh('valid-token');

      const updateCall = (mockPrisma.userSession.update as jest.Mock).mock.calls[0][0];
      const { revokedAt, rotatedAt } = updateCall.data;

      // Both should be Date instances and within 50 ms of each other
      expect(revokedAt).toBeInstanceOf(Date);
      expect(rotatedAt).toBeInstanceOf(Date);
      expect(Math.abs(revokedAt.getTime() - rotatedAt.getTime())).toBeLessThan(50);
    });
  });
});
