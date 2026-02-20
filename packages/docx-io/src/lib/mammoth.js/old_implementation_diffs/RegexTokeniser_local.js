// lib/vendor/lop/index.d.ts:95
export function RegexTokeniser(
  rules: RegexTokeniserRule[]
): RegexTokeniserInstance;

export const rules: Rules & {
  sequence: Rules['sequence'] & {
    capture<T>(rule: Rule<T>, name?: string): Rule<T>;
    extract<T>(rule: Rule<T>): (result: unknown) => T;
    applyValues<T>(
      func: (...values: unknown[]) => T,
      ...rules: Array<Rule<unknown>>
    ): (result: unknown) => T;
    source: { captureName: string };
    cut(): Rule<unknown>;
  };
  leftAssociative: Rules['leftAssociative'] & {
    firstOf(...rules: unknown[]): unknown[];
  };
};
