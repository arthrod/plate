// lib/schema.ts:368
export function warning(message: string): WarningMessage {
  return {
    type: 'warning',
    message,
  };
}
