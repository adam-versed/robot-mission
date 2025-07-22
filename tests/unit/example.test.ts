import { describe, expect, it } from "vitest";

describe("Example Test Suite - AAA Pattern", () => {
	it("should pass a basic test following AAA pattern", () => {
		// Arrange
		const firstNumber = 1;
		const secondNumber = 1;
		const expectedSum = 2;

		// Act
		const actualSum = firstNumber + secondNumber;

		// Assert
		expect(actualSum).toBe(expectedSum);
	});

	it("should handle boolean assertions following AAA pattern", () => {
		// Arrange
		const truthyValue = true;
		const falsyValue = false;

		// Act - in this case, the values are already the result
		// (no action needed for simple boolean checks)

		// Assert
		expect(truthyValue).toBeTruthy();
		expect(falsyValue).toBeFalsy();
	});
});
