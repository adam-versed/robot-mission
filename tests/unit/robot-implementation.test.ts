import { SAMPLE_DATA } from "@/data/sample-data";
import {
	isValidCommand,
	validateCommandString,
} from "@/lib/commands/command-processor";
import { MarsGrid } from "@/lib/grid/grid";
import { MarsRobot } from "@/lib/robot-engine/robot";
import { describe, expect, it } from "vitest";

describe("Robot Implementation Integration Tests", () => {
	describe("MarsRobot Class", () => {
		it("should create robot with correct initial state", () => {
			// Arrange
			const id = "robot-1";
			const name = "Explorer 1";
			const position = { x: 1, y: 1 };
			const orientation = "E" as const;

			// Act
			const robot = new MarsRobot(id, name, position, orientation);

			// Assert
			expect(robot.id).toBe(id);
			expect(robot.name).toBe(name);
			expect(robot.state.position).toEqual(position);
			expect(robot.state.orientation).toBe(orientation);
			expect(robot.state.isLost).toBe(false);
		});

		it("should process individual commands correctly", () => {
			// Arrange
			const robot = new MarsRobot("test", "Test Robot", { x: 2, y: 2 }, "N");
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });

			// Act & Assert - Turn left
			robot.processCommand("L", grid);
			expect(robot.state.orientation).toBe("W");

			// Act & Assert - Turn right
			robot.processCommand("R", grid);
			expect(robot.state.orientation).toBe("N");

			// Act & Assert - Move forward
			robot.processCommand("F", grid);
			expect(robot.state.position).toEqual({ x: 2, y: 3 });
		});

		it("should generate correct output strings", () => {
			// Arrange
			const robot1 = new MarsRobot("1", "Robot 1", { x: 1, y: 1 }, "E");
			const robot2 = new MarsRobot("2", "Robot 2", { x: 3, y: 3 }, "N");

			// Create a grid with boundary that will cause robot2 to become lost
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });

			// Act - Make robot2 lost by moving it off grid
			robot2.processCommand("F", grid); // Move north off grid

			// Assert
			expect(robot1.getOutputString()).toBe("1 1 E");
			expect(robot2.getOutputString()).toBe("3 3 N LOST");
		});
	});

	describe("CommandProcessor Class", () => {
		it("should validate individual commands", () => {
			// Assert valid commands
			expect(isValidCommand("L")).toBe(true);
			expect(isValidCommand("R")).toBe(true);
			expect(isValidCommand("F")).toBe(true);

			// Assert invalid commands
			expect(isValidCommand("X")).toBe(false);
			expect(isValidCommand("l")).toBe(false); // Case sensitive
			expect(isValidCommand("")).toBe(false);
		});

		it("should validate command strings", () => {
			// Assert valid command strings
			expect(validateCommandString("")).toBe(true);
			expect(validateCommandString("LRF")).toBe(true);
			expect(validateCommandString("RFRFRFRF")).toBe(true);

			// Assert invalid command strings
			expect(validateCommandString("LRX")).toBe(false);
			expect(validateCommandString("A".repeat(101))).toBe(false); // Too long
		});
	});

	describe("Sample Data Integration", () => {
		it("should process Robot 1 sample data correctly", () => {
			// Arrange
			const robot1Data = SAMPLE_DATA.robots[0];
			const robot = new MarsRobot(
				"robot-1",
				"Sample Robot 1",
				robot1Data.startPosition,
				robot1Data.startOrientation,
			);
			const grid = new MarsGrid(SAMPLE_DATA.grid);

			// Act
			robot.processCommands(robot1Data.instructions, grid);

			// Assert
			expect(robot.state.position).toEqual(robot1Data.expectedFinalPosition);
			expect(robot.state.orientation).toBe(robot1Data.expectedFinalOrientation);
			expect(robot.state.isLost).toBe(robot1Data.expectedIsLost);
			expect(robot.getOutputString()).toBe(robot1Data.expectedOutput);
		});
	});
});
