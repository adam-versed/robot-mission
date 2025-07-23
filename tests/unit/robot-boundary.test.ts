import { BOUNDARY_TEST_DATA, SAMPLE_DATA } from "@/data/sample-data";
import type { Orientation, RobotState } from "@/lib/types";
import { describe, expect, it } from "vitest";

describe("Robot Boundary Detection and LOST Status", () => {
	describe("Grid Boundary Detection", () => {
		it.each([
			["North", BOUNDARY_TEST_DATA.northBoundary],
			["East", BOUNDARY_TEST_DATA.eastBoundary],
			["South", BOUNDARY_TEST_DATA.southBoundary],
			["West", BOUNDARY_TEST_DATA.westBoundary],
		])("should detect %s boundary breach", (direction, testData) => {
			// Arrange
			const { position, orientation, instructions, gridBounds, shouldBeLost } =
				testData;
			const currentState = {
				position,
				orientation,
				isLost: false,
			};

			// Act
			const result = attemptMove(currentState, instructions, gridBounds);

			// Assert
			expect(result.isLost).toBe(shouldBeLost);
			expect(result.position).toEqual(position);
		});
	});

	describe("LOST Status Scenarios", () => {
		it("should mark robot as LOST when moving off grid", () => {
			// Arrange
			const robotState = {
				position: { x: 5, y: 3 }, // At max bounds
				orientation: "N" as const,
				isLost: false,
			};
			const gridBounds = { maxX: 5, maxY: 3 };

			// Act
			const result = attemptMove(robotState, "F", gridBounds);

			// Assert
			expect(result.isLost).toBe(true);
		});

		it("should preserve final position when robot becomes LOST", () => {
			// Arrange
			const initialPosition = { x: 0, y: 0 };
			const robotState = {
				position: initialPosition,
				orientation: "S" as const,
				isLost: false,
			};
			const gridBounds = { maxX: 5, maxY: 3 };

			// Act
			const result = attemptMove(robotState, "F", gridBounds);

			// Assert
			expect(result.isLost).toBe(true);
			expect(result.position).toEqual(initialPosition); // Should remain at last valid position
		});

		it("should handle robot already LOST status", () => {
			// Arrange
			const robotState = {
				position: { x: 3, y: 3 },
				orientation: "N" as const,
				isLost: true,
			};
			const gridBounds = { maxX: 5, maxY: 3 };

			// Act
			const result = attemptMove(robotState, "F", gridBounds);

			// Assert
			expect(result.isLost).toBe(true); // Should remain LOST
			expect(result.position).toEqual({ x: 3, y: 3 }); // Position unchanged
		});
	});

	describe("Scent System Foundation", () => {
		it("should track scent locations where robots became LOST", () => {
			// Arrange
			const scentTracker = new Set<string>();
			const lostPosition = { x: 3, y: 3 };

			// Act
			addScent(scentTracker, lostPosition);

			// Assert
			expect(hasScent(scentTracker, lostPosition)).toBe(true);
		});

		it("should prevent movement off grid from scented positions", () => {
			// Arrange
			const scentTracker = new Set<string>();
			const scentedPosition = { x: 3, y: 3 };
			addScent(scentTracker, scentedPosition);

			const robotState = {
				position: scentedPosition,
				orientation: "N" as const,
				isLost: false,
			};
			const gridBounds = { maxX: 5, maxY: 3 };

			// Act
			const result = attemptMoveWithScent(
				robotState,
				"F",
				gridBounds,
				scentTracker,
			);

			// Assert
			expect(result.isLost).toBe(false); // Should be protected by scent
			expect(result.position).toEqual(scentedPosition); // Should stay at scented position
		});

		it("should allow safe moves from scented positions", () => {
			// Arrange
			const scentTracker = new Set<string>();
			const scentedPosition = { x: 3, y: 3 };
			addScent(scentTracker, scentedPosition);

			const robotState = {
				position: scentedPosition,
				orientation: "S" as const, // Moving inward
				isLost: false,
			};
			const gridBounds = { maxX: 5, maxY: 3 };

			// Act
			const result = attemptMoveWithScent(
				robotState,
				"F",
				gridBounds,
				scentTracker,
			);

			// Assert
			expect(result.isLost).toBe(false);
			expect(result.position).toEqual({ x: 3, y: 2 }); // Should move safely
		});
	});
});

// Temporary helper functions for testing boundary logic
function attemptMove(
	state: RobotState,
	command: string,
	gridBounds: { maxX: number; maxY: number },
) {
	if (state.isLost) return { ...state }; // Already lost, no movement

	if (command !== "F") return { ...state }; // Only F command moves

	const moves: Record<string, { x: number; y: number }> = {
		N: { x: 0, y: 1 },
		E: { x: 1, y: 0 },
		S: { x: 0, y: -1 },
		W: { x: -1, y: 0 },
	};

	const move = moves[state.orientation];
	if (!move) return { ...state };

	const newPosition = {
		x: state.position.x + move.x,
		y: state.position.y + move.y,
	};

	// Check boundaries
	if (
		newPosition.x < 0 ||
		newPosition.y < 0 ||
		newPosition.x > gridBounds.maxX ||
		newPosition.y > gridBounds.maxY
	) {
		return {
			...state,
			isLost: true,
		};
	}

	return {
		...state,
		position: newPosition,
	};
}

function addScent(
	scentTracker: Set<string>,
	position: { x: number; y: number },
) {
	scentTracker.add(`${position.x},${position.y}`);
}

function hasScent(
	scentTracker: Set<string>,
	position: { x: number; y: number },
): boolean {
	return scentTracker.has(`${position.x},${position.y}`);
}

function attemptMoveWithScent(
	state: RobotState,
	command: string,
	gridBounds: { maxX: number; maxY: number },
	scentTracker: Set<string>,
) {
	if (state.isLost) return { ...state };
	if (command !== "F") return { ...state };

	const moves: Record<string, { x: number; y: number }> = {
		N: { x: 0, y: 1 },
		E: { x: 1, y: 0 },
		S: { x: 0, y: -1 },
		W: { x: -1, y: 0 },
	};

	const move = moves[state.orientation];
	if (!move) return { ...state };

	const newPosition = {
		x: state.position.x + move.x,
		y: state.position.y + move.y,
	};

	// Check if new position would be off grid
	const wouldBeOffGrid =
		newPosition.x < 0 ||
		newPosition.y < 0 ||
		newPosition.x > gridBounds.maxX ||
		newPosition.y > gridBounds.maxY;

	// If move would go off grid and current position has scent, ignore command
	if (wouldBeOffGrid && hasScent(scentTracker, state.position)) {
		return { ...state }; // Ignore the dangerous move
	}

	// If move would go off grid and no scent protection, become lost
	if (wouldBeOffGrid) {
		return {
			...state,
			isLost: true,
		};
	}

	// Safe move
	return {
		...state,
		position: newPosition,
	};
}

function processCommandSequenceWithBoundary(
	state: RobotState,
	commands: string,
	grid: { maxX: number; maxY: number },
) {
	let currentState = { ...state };

	for (const command of commands) {
		if (currentState.isLost) break; // Stop processing if lost

		if (command === "L") {
			const turns: Record<Orientation, Orientation> = {
				N: "W",
				E: "N",
				S: "E",
				W: "S",
			};
			currentState.orientation =
				turns[currentState.orientation] || currentState.orientation;
		} else if (command === "R") {
			const turns: Record<Orientation, Orientation> = {
				N: "E",
				E: "S",
				S: "W",
				W: "N",
			};
			currentState.orientation =
				turns[currentState.orientation] || currentState.orientation;
		} else if (command === "F") {
			currentState = attemptMove(currentState, "F", grid);
		}
	}

	return currentState;
}
