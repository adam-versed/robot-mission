import { DirectionSystem } from "@/lib/direction/DirectionSystem";
import { MarsGrid } from "@/lib/grid/grid";
import { parseInput } from "@/lib/input-parser";
import { MarsRobot } from "@/lib/robot-engine/robot";
import type { GridVisualizationRobot, MissionResults } from "@/lib/types";

/**
 * Process a complete Mars mission from Red Badger format input
 * Returns the final position output for each robot
 */
export function processMission(input: string): MissionResults {
	try {
		// Initialize the direction system with default directions
		const directionSystem = new DirectionSystem();
		directionSystem.initializeDefaults();

		// Parse the input
		const parsed = parseInput(input, directionSystem);

		// Create the grid
		const grid = new MarsGrid(parsed.gridBounds);

		// Process each robot sequentially
		const textOutput: string[] = [];
		const robots: GridVisualizationRobot[] = [];
		let robotIndex = 1;

		for (const robotDef of parsed.robotDefinitions) {
			if (!robotDef) continue;

			// Create robot with unique ID and name
			const robot = new MarsRobot(
				`robot-${robotIndex}`,
				`Robot ${robotIndex}`,
				robotDef.position,
				robotDef.orientation,
				directionSystem,
			);

			// Process the robot's instructions
			robot.processCommands(robotDef.instructions, grid);

			// Get the final output string
			textOutput.push(robot.getOutputString());

			// Collect visualization data
			const robotState = robot.state;
			robots.push({
				id: robot.id,
				finalPosition: robotState.position,
				orientation: robotState.orientation,
				isLost: robotState.isLost,
			});

			robotIndex++;
		}

		// Get scented positions from grid
		const scentedPositions = grid.getScentedPositions();

		return {
			textOutput,
			visualizationData: {
				bounds: parsed.gridBounds,
				robots,
				scentedPositions,
			},
		};
	} catch (error) {
		console.error("Error processing mission:", error);
		return {
			textOutput: [],
			visualizationData: {
				bounds: { maxX: 0, maxY: 0 },
				robots: [],
				scentedPositions: [],
			},
		};
	}
}

/**
 * Format the mission results as a single string (for display)
 */
export function formatMissionResults(results: string[]): string {
	return results.join("\n");
}
