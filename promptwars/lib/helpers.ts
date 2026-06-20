// Reusable helper functions
export const sanitizeInput = (input: string): string => {
  return input.replace(/[^a-zA-Z0-9 -]/g, "").trim();
};

export const parseSafeNumber = (value: unknown, fallback: number = 0): number => {
  const parsed = Number(value);
  return isNaN(parsed) ? fallback : parsed;
};

export const generateId = (): string => {
  return crypto.randomUUID();
};

export const calculatePercentage = (part: number, total: number): number => {
  if (total === 0 || isNaN(total)) return 0;
  return Math.min(100, Math.max(0, (part / total) * 100));
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
