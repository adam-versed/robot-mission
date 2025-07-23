import { MarsGrid } from "@/lib/grid/grid";
import { parseInput } from "@/lib/input-parser";
import { MarsRobot } from "@/lib/robot-engine/robot";

/**
 * Process a complete Mars mission from Red Badger format input
 * Returns the final position output for each robot
 */
export function processMission(input: string): string[] {
	// Parse the input
	const parsed = parseInput(input);

	// Create the grid
	const grid = new MarsGrid(parsed.gridBounds);

	// Process each robot sequentially
	const results: string[] = [];

	for (let i = 0; i < parsed.robotDefinitions.length; i++) {
		const robotDef = parsed.robotDefinitions[i];
		if (!robotDef) continue;

		// Create robot with unique ID and name
		const robot = new MarsRobot(
			`robot-${i + 1}`,
			`Robot ${i + 1}`,
			robotDef.position,
			robotDef.orientation,
		);

		// Process the robot's instructions
		robot.processCommands(robotDef.instructions, grid);

		// Get the final output string
		results.push(robot.getOutputString());
	}

	return results;
}

/**
 * Format the mission results as a single string (for display)
 */
export function formatMissionResults(results: string[]): string {
	return results.join("\n");
}
