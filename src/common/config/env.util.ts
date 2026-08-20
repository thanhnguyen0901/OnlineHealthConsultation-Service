export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

export function parseCsvEnv(value: string | undefined): string[] | undefined {
  const items = value
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return items && items.length > 0 ? items : undefined;
}
