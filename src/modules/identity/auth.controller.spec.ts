import { AuthController } from './auth.controller';

const tokenResult = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  refreshTokenExpiresAt: new Date('2026-09-01T00:00:00.000Z'),
  user: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'patient@example.com',
    firstName: 'Pat',
    lastName: 'Lee',
    role: 'PATIENT',
  },
};

const createController = () => {
  const authService = {
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
  };
  const usersService = {};
  const response = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };

  return {
    controller: new AuthController(authService as any, usersService as any),
    authService,
    response,
  };
};

describe('AuthController refresh cookie contract', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'test',
      AUTH_REFRESH_COOKIE_NAME: 'ohc_refresh_token',
      AUTH_REFRESH_COOKIE_PATH: '/api/auth',
      AUTH_REFRESH_COOKIE_SAME_SITE: 'lax',
      AUTH_REFRESH_COOKIE_SECURE: 'false',
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('sets an HttpOnly refresh cookie on login without returning the refresh token body', async () => {
    const { controller, authService, response } = createController();
    authService.login.mockResolvedValue(tokenResult);

    const result = await controller.login(
      { email: 'patient@example.com', password: 'Password123!' },
      { headers: { 'user-agent': 'jest-agent' }, ip: '127.0.0.1' } as any,
      response as any,
    );

    expect(response.cookie).toHaveBeenCalledWith('ohc_refresh_token', 'refresh-token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/api/auth',
      expires: tokenResult.refreshTokenExpiresAt,
    });
    expect(result).toEqual({
      message: 'Login successful',
      accessToken: 'access-token',
      user: tokenResult.user,
    });
    expect(JSON.stringify(result)).not.toContain('refresh-token');
  });

  it('reads the refresh token from cookie, rotates it, and sets the new cookie', async () => {
    const { controller, authService, response } = createController();
    authService.refresh.mockResolvedValue({ ...tokenResult, refreshToken: 'new-refresh-token' });

    const result = await controller.refresh(
      {
        cookies: { ohc_refresh_token: 'old-refresh-token' },
        headers: { 'user-agent': 'jest-agent' },
        ip: '127.0.0.1',
      } as any,
      response as any,
    );

    expect(authService.refresh).toHaveBeenCalledWith(
      'old-refresh-token',
      'jest-agent',
      '127.0.0.1',
    );
    expect(response.cookie).toHaveBeenCalledWith(
      'ohc_refresh_token',
      'new-refresh-token',
      expect.objectContaining({ httpOnly: true, path: '/api/auth' }),
    );
    expect(result).toEqual({
      message: 'Token refreshed',
      accessToken: 'access-token',
      user: tokenResult.user,
    });
  });

  it('clears the refresh cookie on logout after revoking server sessions', async () => {
    const { controller, authService, response } = createController();
    authService.logout.mockResolvedValue({ message: 'Logout successful' });

    await expect(
      controller.logout({ sub: '11111111-1111-1111-1111-111111111111' }, response as any),
    ).resolves.toEqual({ message: 'Logout successful' });

    expect(authService.logout).toHaveBeenCalledWith('11111111-1111-1111-1111-111111111111');
    expect(response.clearCookie).toHaveBeenCalledWith('ohc_refresh_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/api/auth',
    });
  });

  it('uses secure cookies in production by default', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.AUTH_REFRESH_COOKIE_SECURE;
    const { controller, authService, response } = createController();
    authService.login.mockResolvedValue(tokenResult);

    await controller.login(
      { email: 'patient@example.com', password: 'Password123!' },
      { headers: {}, ip: '127.0.0.1' } as any,
      response as any,
    );

    expect(response.cookie).toHaveBeenCalledWith(
      'ohc_refresh_token',
      'refresh-token',
      expect.objectContaining({ secure: true }),
    );
  });
});
