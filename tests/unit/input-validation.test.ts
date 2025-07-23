import { parseInput } from "@/lib/input-parser";
import { processMission } from "@/lib/mission-processor";
import { describe, expect, it } from "vitest";

describe("Input Parser Validation", () => {
	it("parses single robot multi-line input correctly", () => {
		// Arrange
		const input = `5 3
	1 1 E
	RFRFRFRF`;

		// Act
		const results = processMission(input);

		// Assert
		expect(results.textOutput).toHaveLength(1);
		expect(results.textOutput[0]).toBe("1 1 E");
		expect(results.visualizationData.bounds).toEqual({ maxX: 5, maxY: 3 });
		expect(results.visualizationData.robots).toHaveLength(1);
	});

	it("parses single robot single-line input correctly", () => {
		// Arrange
		const input = "5 3 1 1 E RFRFRFRF";

		// Act
		const results = processMission(input);

		// Assert
		expect(results.textOutput).toHaveLength(1);
		expect(results.textOutput[0]).toBe("1 1 E");
		expect(results.visualizationData.bounds).toEqual({ maxX: 5, maxY: 3 });
		expect(results.visualizationData.robots).toHaveLength(1);
	});

	it("parses multi-robot multi-line input correctly", () => {
		// Arrange
		const input = `5 3
	1 1 E
	RFRFRFRF
	3 2 N
	FRRFLLFFRRFLL
	0 3 W
	LLFFFLFLFL`;

		// Act
		const results = processMission(input);

		// Assert
		expect(results.textOutput).toHaveLength(3);
		expect(results.textOutput[0]).toBe("1 1 E");
		expect(results.textOutput[1]).toBe("3 3 N LOST");
		expect(results.textOutput[2]).toBe("2 3 S");
		expect(results.visualizationData.robots).toHaveLength(3);
		expect(results.visualizationData.scentedPositions).toHaveLength(1);
	});

	it("rejects multi-line input with invalid characters", () => {
		// Arrange
		const input = `5 3
	1 1 E
	INVALID123`;

		// Act & Assert
		expect(() => parseInput(input)).toThrow(
			'Invalid instructions: "INVALID123". Must contain only L, R, F characters',
		);
	});

	it("rejects single-line input with invalid characters", () => {
		// Arrange
		const input = "5 3 1 1 E BAD@CHARS";

		// Act & Assert
		expect(() => parseInput(input)).toThrow(
			'Invalid instructions: "BAD@CHARS". Must contain only L, R, F characters',
		);
	});
});
