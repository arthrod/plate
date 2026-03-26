/// <reference types="vitest/globals" />

declare module "bun:test" {
	export {
		afterAll,
		afterEach,
		beforeAll,
		beforeEach,
		describe,
		expect,
		it,
		test,
		vi,
	} from "vitest";

	export const mock: typeof import("vitest").vi.fn;
}
