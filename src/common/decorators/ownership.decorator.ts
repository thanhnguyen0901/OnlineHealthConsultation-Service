import { SetMetadata } from '@nestjs/common';

export const OWNERSHIP_KEY = 'ownership';

export type OwnershipSource = 'params' | 'body' | 'query';

export type OwnershipRule = {
  source: OwnershipSource;
  field: string;
  allowAdmin?: boolean;
};

export const Ownership = (rule: OwnershipRule) => SetMetadata(OWNERSHIP_KEY, rule);
