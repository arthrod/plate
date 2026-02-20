type TestFn = () => unknown | Promise<unknown>;
type RegisterFn = (name: string, fn: TestFn) => unknown;

module.exports = function (_testModule: unknown) {
  return function register(name: string, definition: unknown) {
    registerDefinition(name, definition);
  };
};

function registerDefinition(name: string, definition: unknown): void {
  if (typeof definition === 'function') {
    runTest(name, definition as TestFn);
    return;
  }

  if (definition && typeof definition === 'object') {
    Object.keys(definition).forEach((childName) => {
      registerDefinition(
        `${name} ${childName}`,
        (definition as Record<string, unknown>)[childName]
      );
    });
    return;
  }

  throw new Error(`Invalid test definition for: ${name}`);
}

function runTest(name: string, func: TestFn): void {
  var register =
    ((globalThis as any).test as RegisterFn | undefined) ||
    ((globalThis as any).it as RegisterFn | undefined);

  if (typeof register !== 'function') {
    try {
      register = require('bun:test').test as RegisterFn;
    } catch (error) {
      void error;
    }
  }

  if (typeof register !== 'function') {
    throw new Error(
      'No global test registrar found (expected test() or it()).'
    );
  }

  register(name, func);
}
