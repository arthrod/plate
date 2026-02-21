module.exports = function(_testModule: unknown) {
    return function(name: string, definition: unknown) {
        registerDefinition(name, definition);
    };
};

function registerDefinition(name: string, definition: unknown): void {
    if (typeof definition === "function") {
        runTest(name, definition as () => unknown | Promise<unknown>);
        return;
    }

    if (definition && typeof definition === "object") {
        Object.keys(definition).forEach(function(childName) {
            registerDefinition(name + " " + childName, (definition as Record<string, unknown>)[childName]);
        });
        return;
    }

    throw new Error("Invalid test definition for: " + name);
}

function runTest(name: string, func: () => unknown | Promise<unknown>): void {
    var register = (globalThis as any).test;
    if (typeof register !== "function") {
        throw new Error("Global test() is unavailable. Run tests with Vitest globals enabled.");
    }
    register(name, func);
}
