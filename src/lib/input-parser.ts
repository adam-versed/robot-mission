import type { GridBounds, Orientation, RobotPosition } from "@/lib/types";

export interface RobotDefinition {
	position: RobotPosition;
	orientation: Orientation;
	instructions: string;
}

export interface ParsedInput {
	gridBounds: GridBounds;
	robotDefinitions: RobotDefinition[];
}

/**
 * Parse Red Badger format input into domain objects
 *
 * Input format:
 * Line 1: Grid upper-right coordinates (maxX maxY)
 * Line 2+: Robot position, orientation, and instructions
 *   - Position line: x y orientation
 *   - Instructions line: command string (L/R/F)
 *
 * Example:
 * 5 3
 * 1 1 E
 * RFRFRFRF
 * 3 2 N
 * FRRFLLFFRRFLL
 */
export function parseInput(input: string): ParsedInput {
	const lines = input
		.trim()
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	if (lines.length < 1) {
		throw new Error("Input must contain at least grid bounds");
	}

	// Parse grid bounds from first line
	const gridLine = lines[0];
	if (!gridLine) {
		throw new Error("Input must contain grid bounds on first line");
	}
	const gridParts = gridLine.split(/\s+/);
	if (gridParts.length !== 2) {
		throw new Error(`Invalid grid format: "${gridLine}". Expected "maxX maxY"`);
	}

	const maxX = Number.parseInt(gridParts[0] || "", 10);
	const maxY = Number.parseInt(gridParts[1] || "", 10);

	if (Number.isNaN(maxX) || Number.isNaN(maxY)) {
		throw new Error(`Invalid grid coordinates: "${gridLine}". Must be numbers`);
	}

	if (maxX < 0 || maxY < 0) {
		throw new Error(
			`Invalid grid bounds: "${gridLine}". Coordinates must be non-negative`,
		);
	}

	if (maxX > 50 || maxY > 50) {
		throw new Error(
			`Invalid grid bounds: "${gridLine}". Maximum coordinate value is 50`,
		);
	}

	const gridBounds: GridBounds = { maxX, maxY };

	// Parse robot definitions from remaining lines
	const robotDefinitions: RobotDefinition[] = [];
	const robotLines = lines.slice(1);

	if (robotLines.length % 2 !== 0) {
		throw new Error(
			"Invalid robot format. Each robot must have a position line and an instructions line",
		);
	}

	for (let i = 0; i < robotLines.length; i += 2) {
		const positionLine = robotLines[i];
		const instructionsLine = robotLines[i + 1];

		if (!positionLine || !instructionsLine) {
			throw new Error(`Missing robot data at lines ${i + 2}-${i + 3}`);
		}

		// Parse position and orientation
		const positionParts = positionLine.split(/\s+/);
		if (positionParts.length !== 3) {
			throw new Error(
				`Invalid robot position format: "${positionLine}". Expected "x y orientation"`,
			);
		}

		const x = Number.parseInt(positionParts[0] || "", 10);
		const y = Number.parseInt(positionParts[1] || "", 10);
		const orientationStr = positionParts[2] || "";

		if (Number.isNaN(x) || Number.isNaN(y)) {
			throw new Error(
				`Invalid robot coordinates: "${positionLine}". x and y must be numbers`,
			);
		}

		if (x < 0 || y < 0) {
			throw new Error(
				`Invalid robot position: "${positionLine}". Coordinates must be non-negative`,
			);
		}

		if (x > gridBounds.maxX || y > gridBounds.maxY) {
			throw new Error(
				`Invalid robot position: "${positionLine}". Robot starts outside grid bounds`,
			);
		}

		if (!isValidOrientation(orientationStr)) {
			throw new Error(
				`Invalid robot orientation: "${orientationStr}". Must be N, S, E, or W`,
			);
		}

		// Validate instructions
		const instructions = instructionsLine.trim();
		if (instructions.length > 100) {
			throw new Error(
				`Invalid instructions: "${instructions}". Must be less than 100 characters`,
			);
		}

		if (instructions.length > 0 && !isValidInstructionString(instructions)) {
			throw new Error(
				`Invalid instructions: "${instructions}". Must contain only L, R, F characters`,
			);
		}

		robotDefinitions.push({
			position: { x, y },
			orientation: orientationStr as Orientation,
			instructions,
		});
	}

	if (robotDefinitions.length === 0) {
		throw new Error("Input must contain at least one robot definition");
	}

	return {
		gridBounds,
		robotDefinitions,
	};
}

function isValidOrientation(orientation: string): orientation is Orientation {
	return (
		orientation === "N" ||
		orientation === "S" ||
		orientation === "E" ||
		orientation === "W"
	);
}

function isValidInstructionString(instructions: string): boolean {
	return /^[LRF]*$/.test(instructions);
}
