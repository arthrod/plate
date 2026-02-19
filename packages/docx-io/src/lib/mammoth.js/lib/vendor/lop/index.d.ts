export interface SourceRange {
  to(otherRange: SourceRange): SourceRange;
  describe(): string;
  lineNumber(): number;
  characterNumber(): number;
}

export interface Token<TValue = unknown> {
  name: string;
  value: TValue;
  source?: SourceRange;
}

export interface TokenIterator<TToken extends Token = Token> {
  head(): TToken | undefined;
  tail(startIndex?: number): TokenIterator<TToken>;
  toArray(): TToken[];
  end(): TToken;
  to(end: TokenIterator<TToken>): SourceRange;
}

export interface ParseError {
  expected: string;
  actual: string;
  describe(): string;
  lineNumber(): number;
  characterNumber(): number;
}

export interface ParsingResult<T> {
  map<U>(func: (value: T, source: SourceRange) => U): ParsingResult<U>;
  changeRemaining(remaining: TokenIterator): ParsingResult<T>;
  isSuccess(): boolean;
  isFailure(): boolean;
  isError(): boolean;
  isCut(): boolean;
  value(): T;
  remaining(): TokenIterator;
  source(): SourceRange;
  errors(): ParseError[];
}

export interface OptionValue<T> {
  value(): T;
  isNone(): boolean;
  isSome(): boolean;
  map<U>(func: (value: T) => U): OptionValue<U>;
  flatMap<U>(func: (value: T) => OptionValue<U>): OptionValue<U>;
  filter(predicate: (value: T) => boolean): OptionValue<T>;
  toArray(): T[];
  orElse<U>(value: U | (() => U)): OptionValue<T> | U;
  valueOrElse<U>(value: U | (() => U)): T | U;
}

export type Rule<T> = (input: TokenIterator) => ParsingResult<T>;

export interface SequenceRule<T = unknown> extends Rule<T> {
  head(): Rule<unknown>;
  map<U>(func: (...values: unknown[]) => U): Rule<U>;
}

export interface Rules {
  token(tokenType: string, value?: unknown): Rule<unknown>;
  tokenOfType(tokenType: string): Rule<unknown>;
  firstOf<T>(name: string, ...parsers: Array<Rule<T>>): Rule<T>;
  then<T, U>(parser: Rule<T>, func: (value: T) => U): Rule<U>;
  sequence(...parsers: Array<Rule<unknown>>): SequenceRule;
  optional<T>(rule: Rule<T>): Rule<OptionValue<T>>;
  zeroOrMoreWithSeparator<T>(rule: Rule<T>, separator: Rule<unknown>): Rule<T[]>;
  oneOrMoreWithSeparator<T>(rule: Rule<T>, separator: Rule<unknown>): Rule<T[]>;
  zeroOrMore<T>(rule: Rule<T>): Rule<T[]>;
  oneOrMore<T>(rule: Rule<T>): Rule<T[]>;
  leftAssociative(
    leftRule: Rule<unknown>,
    rightRule: Rule<unknown>,
    func: (left: unknown, right: unknown, source: SourceRange) => unknown
  ): Rule<unknown>;
  nonConsuming<T>(rule: Rule<T>): Rule<T>;
}

export interface ParserInstance {
  parseTokens<T>(parser: Rule<T>, tokens: Token[]): ParsingResult<T>;
}

export interface RegexTokeniserRule {
  name: string;
  regex: RegExp;
}

export interface RegexTokeniserInstance {
  tokenise(input: string, description?: string): Token[];
}

export function Parser(options?: unknown): ParserInstance;
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

export const errors: {
  error(options: {
    expected: string;
    actual: string;
    location?: SourceRange;
  }): ParseError;
};

export const results: {
  failure(errors: ParseError[], remaining: TokenIterator): ParsingResult<never>;
  error(errors: ParseError[], remaining: TokenIterator): ParsingResult<never>;
  success<T>(
    value: T,
    remaining: TokenIterator,
    source?: SourceRange
  ): ParsingResult<T>;
  cut(remaining: TokenIterator): ParsingResult<never>;
};

export const StringSource: unknown;
export const Token: unknown;
export const bottomUp: unknown;

export function rule<T>(ruleBuilder: () => Rule<T>): Rule<T>;
