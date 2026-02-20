// lib/schema.ts:332
export class Result<T> {
  value: T;
  messages: Message[];

  constructor(value: T, messages?: Message[]) {
    this.value = value;
    this.messages = messages || [];
  }

  map<U>(func: (value: T) => U): Result<U> {
    return new Result(func(this.value), this.messages);
  }

  flatMap<U>(func: (value: T) => Result<U>): Result<U> {
    const funcResult = func(this.value);
    return new Result(funcResult.value, combineMessages([this, funcResult]));
  }

  flatMapThen<U>(func: (value: T) => Promise<Result<U>>): Promise<Result<U>> {
    return func(this.value).then(
      (otherResult) =>
        new Result(otherResult.value, combineMessages([this, otherResult]))
    );
  }

  static combine(results: Result<unknown[]>[]): Result<unknown[]> {
    const values = results.flatMap((r) => r.value);
    const messages = combineMessages(results);
    return new Result(values, messages);
  }
}
