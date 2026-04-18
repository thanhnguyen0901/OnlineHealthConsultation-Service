import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { maskIp, sanitizeAuditMetadata } from '../common/privacy/privacy.util';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    this.$use(async (params, next) => {
      if (
        params.model === 'AuditLog' &&
        ['create', 'createMany', 'update', 'updateMany', 'upsert'].includes(params.action)
      ) {
        const sanitizeData = (data: Record<string, unknown>) => {
          const nextData = { ...data };
          if (nextData.metadata !== undefined) {
            nextData.metadata = sanitizeAuditMetadata(nextData.metadata as Prisma.InputJsonValue);
          }
          if (nextData.ipAddress !== undefined) {
            nextData.ipAddress = maskIp(nextData.ipAddress as string | null);
          }
          return nextData;
        };

        if (params.args?.data) {
          if (Array.isArray(params.args.data)) {
            params.args.data = params.args.data.map((item: Record<string, unknown>) =>
              sanitizeData(item),
            );
          } else {
            params.args.data = sanitizeData(params.args.data as Record<string, unknown>);
          }
        }
      }

      return next(params);
    });

    await this.$connect();
  }
}
