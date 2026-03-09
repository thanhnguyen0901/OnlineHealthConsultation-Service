import { uuidv7 } from 'uuidv7';

// All Prisma creates must pass `id: newId()` explicitly; the schema has no @default(auto()) on any model.
export function newId(): string {
  return uuidv7();
}
