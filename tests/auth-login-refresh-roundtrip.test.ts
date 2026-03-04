/**
 * Regression guard: login → refresh token hash round-trip.
 *
 * Invariant under test
 * ─────────────────────
 * The refresh token stored in user_sessions.refreshTokenHash during login()
 * MUST be the SHA-256 of the exact same string that the controller puts into
 * the httpOnly cookie and that the browser later sends back to /auth/refresh.
 *
 * How a mismatch would manifest
 * ──────────────────────────────
 * If signRefreshToken() were called twice (once inside createSession and once
 * for the return value), each call produces a distinct JWT because of the
 * embedded jwtid (UUIDv7).  The DB would hold hash(token-A) but the cookie
 * would carry token-B, so POST /auth/refresh would always return
 * 401 INVALID_REFRESH_TOKEN / "Refresh token not found".
 *
 * This test proves the single-issuance contract without touching the DB.
 */

import crypto from 'crypto';
import { AppError } from '../src/middlewares/error.middleware';

// ---------------------------------------------------------------------------
// Mock heavy dependencies
// ---------------------------------------------------------------------------

jest.mock('../src/config/db', () => ({
  __esModule: true,
  default: {
    user: { findUnique: jest.fn() },
    userSession: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock('../src/utils/jwt', () => ({
  signAccessToken: jest.fn().mockReturnValue('mock-access-token'),
  // Each call returns a new unique value, mirroring the real implementation
  // which embeds jwtid: uuidv7().  If signRefreshToken() is called more than
  // once in a single login(), the captured tokens will differ.
  signRefreshToken: jest.fn().mockImplementation(() => {
    const uniqueSuffix = Math.random().toString(36).slice(2);
    return `mock-refresh-token-${uniqueSuffix}`;
  }),
  verifyRefreshToken: jest.fn(),
}));

jest.mock('../src/utils/password', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn().mockResolvedValue(true),
}));

jest.mock('../src/utils/sessionCleanup', () => ({
  cleanupUserSessions: jest.fn().mockResolvedValue(0),
}));

jest.mock('../src/utils/id', () => ({
  newId: jest.fn().mockReturnValue('test-session-id'),
}));

// ---------------------------------------------------------------------------
// Import after mocks
// ---------------------------------------------------------------------------
import prisma from '../src/config/db';
import { signRefreshToken, verifyRefreshToken } from '../src/utils/jwt';
import { AuthService } from '../src/services/auth.service';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockSignRefreshToken = signRefreshToken as jest.Mock;
const mockVerifyRefreshToken = verifyRefreshToken as jest.Mock;

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const mockUser = {
  id: 'user-test-001',
  email: 'test@example.com',
  passwordHash: '$2a$12$fakehash',
  firstName: 'Test',
  lastName: 'User',
  role: 'PATIENT' as const,
  isActive: true,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  patientProfile: { id: 'pp-001', userId: 'user-test-001' },
  doctorProfile: null,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sha256hex(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('login() → refresh token single-issuance contract', () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService();

    // Default: user lookup succeeds
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    // Session create always succeeds
    (mockPrisma.userSession.create as jest.Mock).mockResolvedValue({});
  });

  it('stores SHA-256(returnedRefreshToken) in user_sessions — not a different token', async () => {
    const result = await service.login({ email: 'test@example.com', password: 'secret' });

    // signRefreshToken must have been called exactly ONCE.
    // A second call would produce a different token (unique jwtid), creating a
    // mismatch between what is stored and what is returned.
    expect(mockSignRefreshToken).toHaveBeenCalledTimes(1);

    // Capture the exact token that was returned (= what the controller puts in
    // the cookie).
    const returnedToken = result.refreshToken;
    expect(typeof returnedToken).toBe('string');
    expect(returnedToken.length).toBeGreaterThan(0);

    // Capture the hash that was written to user_sessions.
    const createCall = (mockPrisma.userSession.create as jest.Mock).mock.calls[0][0] as {
      data: { refreshTokenHash: string };
    };
    const storedHash = createCall.data.refreshTokenHash;

    // THE KEY ASSERTION:
    // hash(cookie token) must equal the stored hash.
    // If there were any double-generation, returnedToken !== tokenPassedToCreate
    // and this assertion would fail.
    expect(storedHash).toBe(sha256hex(returnedToken));
  });

  it('returning the same token object after createSession (no re-generation)', async () => {
    const result1 = await service.login({ email: 'test@example.com', password: 'secret' });
    jest.clearAllMocks();
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (mockPrisma.userSession.create as jest.Mock).mockResolvedValue({});
    const result2 = await service.login({ email: 'test@example.com', password: 'secret' });

    // Two separate logins produce two distinct tokens because signRefreshToken
    // mock returns a new unique value each call.  Tokens must differ.
    expect(result1.refreshToken).not.toBe(result2.refreshToken);

    // But for EACH individual call, hash(returned) === stored hash.
    const hash1 = ((mockPrisma.userSession.create as jest.Mock).mock.calls[0][0] as {
      data: { refreshTokenHash: string };
    }).data.refreshTokenHash;
    expect(sha256hex(result2.refreshToken)).toBe(hash1);
  });
});

describe('refresh() path uses the same hash function as login()', () => {
  let service: AuthService;

  const KNOWN_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6InUxIn0.fakesig';
  const KNOWN_HASH = sha256hex(KNOWN_TOKEN);

  const mockSession = {
    id: 'session-001',
    userId: 'user-test-001',
    refreshTokenHash: KNOWN_HASH,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    revokedAt: null,
    rotatedAt: null,
    lastUsedAt: new Date(),
    createdAt: new Date(),
    userAgent: null,
    ipAddress: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService();

    mockVerifyRefreshToken.mockReturnValue({ id: 'user-test-001', role: 'PATIENT' });
    (mockPrisma.userSession.findUnique as jest.Mock).mockResolvedValue(mockSession);
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (mockPrisma.$transaction as jest.Mock).mockResolvedValue([{}, {}]);
  });

  it('calls findUnique with SHA-256 of the cookie token', async () => {
    await service.refresh(KNOWN_TOKEN);

    const findCall = (mockPrisma.userSession.findUnique as jest.Mock).mock.calls[0][0] as {
      where: { refreshTokenHash: string };
    };
    // The hash passed to findUnique must be SHA-256 of the raw token
    // (same algorithm used during login's createSession).
    expect(findCall.where.refreshTokenHash).toBe(KNOWN_HASH);
  });

  it('throws INVALID_REFRESH_TOKEN when a different token is submitted', async () => {
    // Simulate the mismatch scenario: the session stored hash(T1) but the
    // browser sends T2.  findUnique returns null because hash(T2) ≠ hash(T1).
    (mockPrisma.userSession.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      service.refresh('completely-different-token')
    ).rejects.toMatchObject({
      code: 'INVALID_REFRESH_TOKEN',
      message: 'Refresh token not found',
    });
  });
});
