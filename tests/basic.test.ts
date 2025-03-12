import { describe, test, expect } from "vitest"
import { setup } from "@nuxt/test-utils/e2e"

describe("My test", async () => {
	await setup({
		// test context options
	})

	test("my test", () => {
		expect(1).toBe(1)
	})
})
