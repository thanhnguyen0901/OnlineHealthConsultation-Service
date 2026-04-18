import { Prisma } from '@prisma/client';

const SENSITIVE_KEYS = new Set([
  'password',
  'newPassword',
  'token',
  'refreshToken',
  'authorization',
  'medicalHistory',
  'address',
  'phone',
  'email',
  'ipAddress',
  'userAgent',
]);

export function maskEmail(email?: string | null): string | null {
  if (!email) {
    return null;
  }
  const [local, domain] = email.split('@');
  if (!local || !domain) {
    return '***';
  }
  const visible = local.length <= 2 ? local[0] ?? '*' : `${local[0]}***${local[local.length - 1]}`;
  return `${visible}@${domain}`;
}

export function maskPhone(phone?: string | null): string | null {
  if (!phone) {
    return null;
  }
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 4) {
    return '****';
  }
  return `${'*'.repeat(Math.max(digits.length - 4, 0))}${digits.slice(-4)}`;
}

export function maskIp(ip?: string | null): string | null {
  if (!ip) {
    return null;
  }
  if (ip.includes(':')) {
    const parts = ip.split(':');
    return `${parts.slice(0, 2).join(':')}::`;
  }
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  }
  return '0.0.0.0';
}

export function sanitizeAuditMetadata(metadata?: Prisma.InputJsonValue): Prisma.InputJsonValue | undefined {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return metadata;
  }

  const obj = metadata as Record<string, unknown>;
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const lowered = key.toLowerCase();

    if (SENSITIVE_KEYS.has(lowered)) {
      if (lowered.includes('email')) {
        sanitized[key] = maskEmail(typeof value === 'string' ? value : null);
      } else if (lowered.includes('phone')) {
        sanitized[key] = maskPhone(typeof value === 'string' ? value : null);
      } else if (lowered.includes('ip')) {
        sanitized[key] = maskIp(typeof value === 'string' ? value : null);
      } else if (lowered.includes('useragent')) {
        sanitized[key] = value ? '[REDACTED_USER_AGENT]' : null;
      } else {
        sanitized[key] = '[REDACTED]';
      }
      continue;
    }

    sanitized[key] = value;
  }

  return sanitized as Prisma.InputJsonValue;
}
