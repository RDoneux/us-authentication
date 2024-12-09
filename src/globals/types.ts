export const TokenType = {
  REFRESH: 'refresh',
  ACCESS: 'access',
} as const;
export type TokenType = (typeof TokenType)[keyof typeof TokenType];
