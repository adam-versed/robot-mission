import { SAMPLE_INPUT_RAW, SAMPLE_OUTPUT_RAW } from "@/data/sample-data";
import { formatMissionResults, processMission } from "@/lib/mission-processor";
import { describe, expect, it } from "vitest";

describe("Mission Processor", () => {
	describe("processMission", () => {
		it("processes mandatory Red Badger sample data correctly", () => {
			// Act
			const results = processMission(SAMPLE_INPUT_RAW);

			// Assert
			expect(results.textOutput).toHaveLength(3);
			expect(results.textOutput[0]).toBe("1 1 E");
			expect(results.textOutput[1]).toBe("3 3 N LOST");
			expect(results.textOutput[2]).toBe("2 3 S");

			// Also verify visualization data
			expect(results.visualizationData.bounds).toEqual({ maxX: 5, maxY: 3 });
			expect(results.visualizationData.robots).toHaveLength(3);
			expect(results.visualizationData.scentedPositions).toHaveLength(1);
		});

		it("handles robot that becomes lost", () => {
			// Arrange
			const input = `1 1
      0 0 N
      FF`;

			// Act
			const results = processMission(input);

			// Assert
			expect(results.textOutput).toHaveLength(1);
			expect(results.textOutput[0]).toBe("0 1 N LOST");
		});

		it("handles robot with no movement commands", () => {
			// Arrange
			const input = `5 3
      2 2 N
      LR`;

			// Act
			const results = processMission(input);

			// Assert
			expect(results.textOutput).toHaveLength(1);
			expect(results.textOutput[0]).toBe("2 2 N"); // Robot turns left then right, ends up facing North again
		});
	});

	describe("formatMissionResults", () => {
		it("formats results with newlines", () => {
			// Arrange
			const results = ["1 1 E", "3 3 N LOST", "2 3 S"];

			// Act
			const formatted = formatMissionResults(results);

			// Assert
			expect(formatted).toBe("1 1 E\n3 3 N LOST\n2 3 S");
			expect(formatted).toBe(SAMPLE_OUTPUT_RAW);
		});
	});
});
