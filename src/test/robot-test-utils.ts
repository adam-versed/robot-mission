import { expect } from "vitest";
import type {
	GridBounds,
	Orientation,
	RobotPosition,
	RobotState,
} from "../lib/types.js";

/**
 * Custom matchers for robot logic testing
 */

/**
 * Test helper to create robot states
 */
export function createRobotState(
	x: number,
	y: number,
	orientation: Orientation,
	isLost = false,
): RobotState {
	return {
		position: { x, y },
		orientation,
		isLost,
	};
}

/**
 * Test helper to create grid bounds
 */
export function createGridBounds(maxX: number, maxY: number): GridBounds {
	return { maxX, maxY };
}

/**
 * Custom matcher to check if position is within grid bounds
 */
export function expectPositionInBounds(
	position: RobotPosition,
	bounds: GridBounds,
) {
	expect(position.x).toBeGreaterThanOrEqual(0);
	expect(position.y).toBeGreaterThanOrEqual(0);
	expect(position.x).toBeLessThanOrEqual(bounds.maxX);
	expect(position.y).toBeLessThanOrEqual(bounds.maxY);
}

/**
 * Custom matcher to check robot state equality
 */
export function expectRobotState(actual: RobotState, expected: RobotState) {
	expect(actual.position.x).toBe(expected.position.x);
	expect(actual.position.y).toBe(expected.position.y);
	expect(actual.orientation).toBe(expected.orientation);
	expect(actual.isLost).toBe(expected.isLost);
}

/**
 * Test helper for valid orientations
 */
export const VALID_ORIENTATIONS: Orientation[] = ["N", "E", "S", "W"];

/**
 * Test helper for invalid orientations (for error testing)
 */
export const INVALID_ORIENTATIONS = ["X", "Y", "Z", ""];

/**
 * Test helper for valid commands
 */
export const VALID_COMMANDS = ["L", "R", "F"];

/**
 * Test helper for invalid commands (for error testing)
 */
export const INVALID_COMMANDS = ["X", "Y", "Z", ""];
