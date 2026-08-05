export const normalizePhone = (value: string): string => value.replace(/\D/g, "");

export const normalizePlate = (value: string): string =>
  value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

export const duplicateWindowStart = (now: Date, windowMinutes = 10): Date =>
  new Date(now.getTime() - windowMinutes * 60_000);
