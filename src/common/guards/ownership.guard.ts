import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

import { OWNERSHIP_KEY, OwnershipRule } from '../decorators/ownership.decorator';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rule = this.reflector.getAllAndOverride<OwnershipRule>(OWNERSHIP_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!rule) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as { sub?: string; role?: Role } | undefined;
    if (!user?.sub) {
      return false;
    }

    if (rule.allowAdmin && user.role === Role.ADMIN) {
      return true;
    }

    const ownerId = request?.[rule.source]?.[rule.field];
    return !!ownerId && ownerId === user.sub;
  }
}
