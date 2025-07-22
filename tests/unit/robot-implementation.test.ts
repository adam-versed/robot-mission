import {
	isValidCommand,
	validateCommandString,
} from "@/lib/commands/command-processor";
import { MarsGrid } from "@/lib/grid/grid";
import { MarsRobot } from "@/lib/robot-engine/robot";
import { SAMPLE_DATA } from "@/test/sample-data";
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

	describe("MarsGrid Class", () => {
		it("should validate positions correctly", () => {
			// Arrange
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });

			// Assert valid positions
			expect(grid.isValidPosition({ x: 0, y: 0 })).toBe(true);
			expect(grid.isValidPosition({ x: 5, y: 3 })).toBe(true);
			expect(grid.isValidPosition({ x: 2, y: 1 })).toBe(true);

			// Assert invalid positions
			expect(grid.isValidPosition({ x: -1, y: 0 })).toBe(false);
			expect(grid.isValidPosition({ x: 6, y: 3 })).toBe(false);
			expect(grid.isValidPosition({ x: 5, y: 4 })).toBe(false);
		});

		it("should manage scents correctly", () => {
			// Arrange
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });
			const scentPosition = { x: 3, y: 3 };

			// Act
			grid.addScent(scentPosition);

			// Assert
			expect(grid.hasScent(scentPosition)).toBe(true);
			expect(grid.hasScent({ x: 2, y: 2 })).toBe(false);
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

		it("should process Robot 2 sample data correctly (LOST scenario)", () => {
			// Arrange
			const robot2Data = SAMPLE_DATA.robots[1];
			const robot = new MarsRobot(
				"robot-2",
				"Sample Robot 2",
				robot2Data.startPosition,
				robot2Data.startOrientation,
			);
			const grid = new MarsGrid(SAMPLE_DATA.grid);

			// Act
			robot.processCommands(robot2Data.instructions, grid);

			// Assert
			expect(robot.state.position).toEqual(robot2Data.expectedFinalPosition);
			expect(robot.state.orientation).toBe(robot2Data.expectedFinalOrientation);
			expect(robot.state.isLost).toBe(robot2Data.expectedIsLost);
			expect(robot.getOutputString()).toBe(robot2Data.expectedOutput);
		});

		it("should process Robot 3 sample data correctly (with scent protection)", () => {
			// Arrange
			const grid = new MarsGrid(SAMPLE_DATA.grid);

			// First, process Robot 2 to create scent at (3,3)
			const robot2Data = SAMPLE_DATA.robots[1];
			const robot2 = new MarsRobot(
				"robot-2",
				"Robot 2",
				robot2Data.startPosition,
				robot2Data.startOrientation,
			);
			robot2.processCommands(robot2Data.instructions, grid);

			// Now process Robot 3
			const robot3Data = SAMPLE_DATA.robots[2];
			const robot3 = new MarsRobot(
				"robot-3",
				"Robot 3",
				robot3Data.startPosition,
				robot3Data.startOrientation,
			);

			// Act
			robot3.processCommands(robot3Data.instructions, grid);

			// Assert
			expect(robot3.state.position).toEqual(robot3Data.expectedFinalPosition);
			expect(robot3.state.orientation).toBe(
				robot3Data.expectedFinalOrientation,
			);
			expect(robot3.state.isLost).toBe(robot3Data.expectedIsLost);
			expect(robot3.getOutputString()).toBe(robot3Data.expectedOutput);
		});

		it("should process all sample robots in sequence", () => {
			// Arrange
			const grid = new MarsGrid(SAMPLE_DATA.grid);
			const results: string[] = [];

			// Act - Process each robot in sequence
			SAMPLE_DATA.robots.forEach((robotData, index) => {
				const robot = new MarsRobot(
					`robot-${index + 1}`,
					`Sample Robot ${index + 1}`,
					robotData.startPosition,
					robotData.startOrientation,
				);
				robot.processCommands(robotData.instructions, grid);
				results.push(robot.getOutputString());
			});

			// Assert
			expect(results).toEqual(SAMPLE_DATA.expectedOutputs);
		});
	});
});
