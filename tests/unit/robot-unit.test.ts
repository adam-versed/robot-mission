import type { DirectionSystem } from "@/lib/direction/DirectionSystem";
import { MarsGrid } from "@/lib/grid/grid";
import { MarsRobot } from "@/lib/robot-engine/robot";
import { describe, expect, test, vi } from "vitest";

// Mock DirectionSystem for true unit testing
function createMockDirectionSystem(): DirectionSystem {
	const mockDirections = new Map();

	return {
		turn: vi.fn(),
		getMovementVector: vi.fn(),
		register: vi.fn(),
		isRegistered: vi.fn(),
		getRegisteredDirections: vi.fn(),
		getDirection: vi.fn(),
		clear: vi.fn(),
		initializeDefaults: vi.fn(),
		// Add the missing properties
		directions: mockDirections,
		normalizeDegrees: vi.fn((degrees: number) => degrees % 360),
		findClosestDirection: vi.fn(),
		calculateDegreeDifference: vi.fn(),
	} as unknown as DirectionSystem;
}

describe("MarsRobot Unit Tests", () => {
	describe("Robot State Management", () => {
		test("should create robot with correct initial state", () => {
			// Arrange
			const mockDirectionSystem = createMockDirectionSystem();
			const id = "robot-1";
			const name = "Explorer 1";
			const position = { x: 1, y: 1 };
			const orientation = "E" as const;

			// Act
			const robot = new MarsRobot(
				id,
				name,
				position,
				orientation,
				mockDirectionSystem,
			);

			// Assert
			expect(robot.id).toBe(id);
			expect(robot.name).toBe(name);
			expect(robot.state.position).toEqual(position);
			expect(robot.state.orientation).toBe(orientation);
			expect(robot.state.isLost).toBe(false);
		});

		test("should generate correct output string for normal robot", () => {
			// Arrange
			const mockDirectionSystem = createMockDirectionSystem();
			const robot = new MarsRobot(
				"1",
				"Robot 1",
				{ x: 1, y: 1 },
				"E",
				mockDirectionSystem,
			);

			// Act
			const output = robot.getOutputString();

			// Assert
			expect(output).toBe("1 1 E");
		});

		test("should generate correct output string for lost robot", () => {
			// Arrange
			const mockDirectionSystem = createMockDirectionSystem();
			mockDirectionSystem.getMovementVector = vi.fn().mockReturnValue([0, 1]); // North vector
			const robot = new MarsRobot(
				"1",
				"Robot 1",
				{ x: 3, y: 3 },
				"N",
				mockDirectionSystem,
			);
			// Create a grid where robot is at the edge
			const grid = new MarsGrid({ maxX: 3, maxY: 3 });

			// Make robot move beyond boundary to become lost
			robot.processCommand("F", grid);

			// Act
			const output = robot.getOutputString();

			// Assert
			expect(output).toBe("3 3 N LOST");
		});
	});

	describe("Command Processing", () => {
		test("should call DirectionSystem.turn with correct parameters for left turn", () => {
			// Arrange
			const mockDirectionSystem = createMockDirectionSystem();
			mockDirectionSystem.turn = vi.fn().mockReturnValue("W");
			const robot = new MarsRobot(
				"test",
				"Test Robot",
				{ x: 2, y: 2 },
				"N",
				mockDirectionSystem,
			);
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });

			// Act
			robot.processCommand("L", grid);

			// Assert
			expect(mockDirectionSystem.turn).toHaveBeenCalledWith("N", -90);
			expect(robot.state.orientation).toBe("W");
		});

		test("should call DirectionSystem.turn with correct parameters for right turn", () => {
			// Arrange
			const mockDirectionSystem = createMockDirectionSystem();
			mockDirectionSystem.turn = vi.fn().mockReturnValue("E");
			const robot = new MarsRobot(
				"test",
				"Test Robot",
				{ x: 2, y: 2 },
				"N",
				mockDirectionSystem,
			);
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });

			// Act
			robot.processCommand("R", grid);

			// Assert
			expect(mockDirectionSystem.turn).toHaveBeenCalledWith("N", 90);
			expect(robot.state.orientation).toBe("E");
		});

		test("should call DirectionSystem.getMovementVector for forward movement", () => {
			// Arrange
			const mockDirectionSystem = createMockDirectionSystem();
			mockDirectionSystem.getMovementVector = vi.fn().mockReturnValue([0, 1]); // North vector
			const robot = new MarsRobot(
				"test",
				"Test Robot",
				{ x: 2, y: 2 },
				"N",
				mockDirectionSystem,
			);
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });

			// Act
			robot.processCommand("F", grid);

			// Assert
			expect(mockDirectionSystem.getMovementVector).toHaveBeenCalledWith("N");
			expect(robot.state.position).toEqual({ x: 2, y: 3 });
		});

		test("should handle invalid command gracefully", () => {
			// Arrange
			const mockDirectionSystem = createMockDirectionSystem();
			const robot = new MarsRobot(
				"test",
				"Test Robot",
				{ x: 2, y: 2 },
				"N",
				mockDirectionSystem,
			);
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });
			const initialState = { ...robot.state };

			// Act & Assert
			expect(() => robot.processCommand("X" as "L", grid)).toThrow(
				"Invalid command: X",
			);
			expect(robot.state).toEqual(initialState); // State unchanged
		});
	});

	describe("Boundary Handling", () => {
		test("should not move when hitting boundary with no scent", () => {
			// Arrange
			const mockDirectionSystem = createMockDirectionSystem();
			mockDirectionSystem.getMovementVector = vi.fn().mockReturnValue([0, 1]); // North vector
			const robot = new MarsRobot(
				"test",
				"Test Robot",
				{ x: 2, y: 3 },
				"N",
				mockDirectionSystem,
			);
			const grid = new MarsGrid({ maxX: 5, maxY: 3 }); // Robot at top edge

			// Act
			robot.processCommand("F", grid);

			// Assert
			expect(robot.state.position).toEqual({ x: 2, y: 3 }); // Position unchanged
			expect(robot.state.isLost).toBe(true);
		});

		test("should handle successful forward movement within bounds", () => {
			// Arrange
			const mockDirectionSystem = createMockDirectionSystem();
			mockDirectionSystem.getMovementVector = vi.fn().mockReturnValue([0, 1]); // North vector
			const robot = new MarsRobot(
				"test",
				"Test Robot",
				{ x: 2, y: 2 },
				"N",
				mockDirectionSystem,
			);
			const grid = new MarsGrid({ maxX: 5, maxY: 5 }); // Larger grid, robot not at boundary

			// Act
			robot.processCommand("F", grid);

			// Assert
			expect(mockDirectionSystem.getMovementVector).toHaveBeenCalledWith("N");
			expect(robot.state.position).toEqual({ x: 2, y: 3 }); // Moved north
			expect(robot.state.isLost).toBe(false);
		});
	});
});
