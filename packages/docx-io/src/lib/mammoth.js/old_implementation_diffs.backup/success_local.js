// lib/schema.ts:364
export function success<T>(value: T): Result<T> {
  return new Result(value, []);
}
