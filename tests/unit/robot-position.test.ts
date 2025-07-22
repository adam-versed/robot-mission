import {
	VALID_ORIENTATIONS,
	createRobotState,
	expectRobotState,
} from "@/test/robot-test-utils";
import { describe, expect, it } from "vitest";

describe("Robot Position and Orientation Tracking", () => {
	describe("Robot State Creation", () => {
		it("should create a robot with valid position and orientation", () => {
			// Arrange
			const x = 1;
			const y = 2;
			const orientation = "N" as const;
			const expectedState = {
				position: { x: 1, y: 2 },
				orientation: "N" as const,
				isLost: false,
			};

			// Act
			const robotState = createRobotState(x, y, orientation);

			// Assert
			expectRobotState(robotState, expectedState);
		});

		it("should create a robot with lost status when specified", () => {
			// Arrange
			const x = 3;
			const y = 3;
			const orientation = "E" as const;
			const isLost = true;
			const expectedState = {
				position: { x: 3, y: 3 },
				orientation: "E" as const,
				isLost: true,
			};

			// Act
			const robotState = createRobotState(x, y, orientation, isLost);

			// Assert
			expectRobotState(robotState, expectedState);
		});

		it("should handle all valid orientations", () => {
			// Arrange & Act & Assert
			for (const orientation of VALID_ORIENTATIONS) {
				const robotState = createRobotState(0, 0, orientation);
				expect(robotState.orientation).toBe(orientation);
			}
		});
	});

	describe("Position Tracking", () => {
		it("should track position coordinates correctly", () => {
			// Arrange
			const testCases = [
				{ x: 0, y: 0 },
				{ x: 5, y: 3 },
				{ x: 50, y: 50 }, // Max coordinate values per spec (50 for both X and Y)
			];

			for (const { x, y } of testCases) {
				// Act
				const robotState = createRobotState(x, y, "N");

				// Assert
				expect(robotState.position.x).toBe(x);
				expect(robotState.position.y).toBe(y);
			}
		});
	});

	describe("Lost Status Tracking", () => {
		it("should track not lost status by default", () => {
			// Arrange & Act
			const robotState = createRobotState(2, 3, "N");

			// Assert
			expect(robotState.isLost).toBe(false);
		});

		it("should track lost status when specified", () => {
			// Arrange & Act
			const robotState = createRobotState(3, 3, "N", true);

			// Assert
			expect(robotState.isLost).toBe(true);
		});

		it("should maintain lost status immutability", () => {
			// Arrange
			const robotState1 = createRobotState(1, 1, "N", false);
			const robotState2 = createRobotState(2, 2, "E", true);

			// Act - no mutation should occur

			// Assert
			expect(robotState1.isLost).toBe(false);
			expect(robotState2.isLost).toBe(true);
		});
	});
});
