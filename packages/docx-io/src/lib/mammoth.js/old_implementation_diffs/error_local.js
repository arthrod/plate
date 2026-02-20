// lib/schema.ts:375
export function error(exception: { message: string }): ErrorMessage {
  return {
    type: 'error',
    message: exception.message,
    error: exception,
  };
}
