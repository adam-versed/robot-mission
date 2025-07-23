import { SAMPLE_DATA } from "@/data/sample-data";
import {
	isValidCommand,
	validateCommandString,
} from "@/lib/commands/command-processor";
import { DirectionSystem } from "@/lib/direction/DirectionSystem";
import { MarsGrid } from "@/lib/grid/grid";
import { MarsRobot } from "@/lib/robot-engine/robot";
import { beforeEach, describe, expect, it } from "vitest";

describe("Robot Integration Tests", () => {
	let directionSystem: DirectionSystem;

	beforeEach(() => {
		directionSystem = new DirectionSystem();
		directionSystem.initializeDefaults();
	});

	describe("MarsRobot with DirectionSystem Integration", () => {
		it("should create robot with correct initial state", () => {
			// Arrange
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
				directionSystem,
			);

			// Assert
			expect(robot.id).toBe(id);
			expect(robot.name).toBe(name);
			expect(robot.state.position).toEqual(position);
			expect(robot.state.orientation).toBe(orientation);
			expect(robot.state.isLost).toBe(false);
		});

		it("should process individual commands correctly", () => {
			// Arrange
			const robot = new MarsRobot(
				"test",
				"Test Robot",
				{ x: 2, y: 2 },
				"N",
				directionSystem,
			);
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
			const robot1 = new MarsRobot(
				"1",
				"Robot 1",
				{ x: 1, y: 1 },
				"E",
				directionSystem,
			);
			const robot2 = new MarsRobot(
				"2",
				"Robot 2",
				{ x: 3, y: 3 },
				"N",
				directionSystem,
			);

			// Act - Process some commands
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });
			robot1.processCommand("R", grid);
			robot1.processCommand("F", grid);
			robot1.processCommand("R", grid);
			robot1.processCommand("F", grid);
			robot1.processCommand("R", grid);
			robot1.processCommand("F", grid);
			robot1.processCommand("R", grid);
			robot1.processCommand("F", grid);

			// Robot 2 - simulate lost scenario
			robot2.processCommand("F", grid); // Should be lost

			// Assert
			expect(robot1.getOutputString()).toBe("1 1 E");
			expect(robot2.getOutputString()).toBe("3 3 N LOST");
		});
	});

	describe("Sample Data Integration", () => {
		it("should process Robot 1 sample data correctly", () => {
			// Arrange
			const robot = new MarsRobot(
				"1",
				"Robot 1",
				{ x: 1, y: 1 },
				"E",
				directionSystem,
			);
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });

			// Act - Process Robot 1 sample instructions: RFRFRFRF
			robot.processCommands("RFRFRFRF", grid);

			// Assert
			expect(robot.getOutputString()).toBe("1 1 E");
		});

		it("should process Robot 2 sample data correctly (LOST scenario)", () => {
			// Arrange
			const robot = new MarsRobot(
				"2",
				"Robot 2",
				{ x: 3, y: 2 },
				"N",
				directionSystem,
			);
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });

			// Act - Process Robot 2 sample instructions: FRRFLLFFRRFLL (partial)
			robot.processCommands("FRRFLLFFRRFLL", grid);

			// Assert
			expect(robot.getOutputString()).toBe("3 3 N LOST");
		});

		it("should process Robot 3 sample data correctly (with scent protection)", () => {
			// Arrange
			const robot = new MarsRobot(
				"3",
				"Robot 3",
				{ x: 0, y: 3 },
				"W",
				directionSystem,
			);
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });

			// First, simulate Robot 2 getting lost to create scent
			const robot2 = new MarsRobot(
				"2",
				"Robot 2",
				{ x: 3, y: 2 },
				"N",
				directionSystem,
			);
			robot2.processCommands("FRRFLLFFRRFLL", grid);

			// Act - Process Robot 3 sample instructions: LLFFFLFLFL
			robot.processCommands("LLFFFLFLFL", grid);

			// Assert
			expect(robot.getOutputString()).toBe("2 3 S");
		});

		it("should process all sample robots in sequence", () => {
			// Arrange
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });
			const results: string[] = [];

			// Robot 1
			const robot1 = new MarsRobot(
				"1",
				"Robot 1",
				{ x: 1, y: 1 },
				"E",
				directionSystem,
			);
			robot1.processCommands("RFRFRFRF", grid);
			results.push(robot1.getOutputString());

			// Robot 2
			const robot2 = new MarsRobot(
				"2",
				"Robot 2",
				{ x: 3, y: 2 },
				"N",
				directionSystem,
			);
			robot2.processCommands("FRRFLLFFRRFLL", grid);
			results.push(robot2.getOutputString());

			// Robot 3 (benefits from Robot 2's scent)
			const robot3 = new MarsRobot(
				"3",
				"Robot 3",
				{ x: 0, y: 3 },
				"W",
				directionSystem,
			);
			robot3.processCommands("LLFFFLFLFL", grid);
			results.push(robot3.getOutputString());

			// Assert
			expect(results).toEqual(["1 1 E", "3 3 N LOST", "2 3 S"]);
		});
	});

	describe("Command Validation Integration", () => {
		it("should validate individual commands", () => {
			expect(isValidCommand("L")).toBe(true);
			expect(isValidCommand("R")).toBe(true);
			expect(isValidCommand("F")).toBe(true);
			expect(isValidCommand("X")).toBe(false);
		});

		it("should validate command strings", () => {
			expect(validateCommandString("LRFRLF")).toBe(true);
			expect(validateCommandString("LRFRLX")).toBe(false);
			expect(validateCommandString("")).toBe(true);
		});
	});
});
