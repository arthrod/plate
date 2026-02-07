export type ClassValue = string | number | boolean | undefined | null;
export type ClassArray = ClassValue[];
export type ClassDictionary = Record<string, any>;

export function cn(...inputs: (ClassValue | ClassArray | ClassDictionary)[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) classes.push(key);
      }
    }
  }

  return classes.join(' ');
}
