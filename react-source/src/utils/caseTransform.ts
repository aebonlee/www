/**
 * caseTransform.ts — snake_case ↔ camelCase 변환 헬퍼
 */

export function toCamelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

export function toSnakeKey(key: string): string {
  return key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toCamel(row: Record<string, any> | null): Record<string, any> | null {
  if (!row) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(row)) {
    out[toCamelKey(k)] = v;
  }
  return out;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toSnake(obj: Record<string, any> | null): Record<string, any> | null {
  if (!obj) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[toSnakeKey(k)] = v;
  }
  return out;
}
