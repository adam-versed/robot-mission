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
 * Supports both multi-line and single-line input formats:
 *
 * Multi-line format:
 * Line 1: Grid upper-right coordinates (maxX maxY)
 * Line 2+: Robot position, orientation, and instructions
 *   - Position line: x y orientation
 *   - Instructions line: command string (L/R/F)
 *
 * Multi-line example:
 * 5 3
 * 1 1 E
 * RFRFRFRF
 * 3 2 N
 * FRRFLLFFRRFLL
 *
 * Single-line format:
 * Space-separated: maxX maxY x1 y1 orientation1 instructions1 x2 y2 orientation2 instructions2...
 *
 * Single-line example:
 * 5 3 1 1 E RFRFRFRF 3 2 N FRRFLLFFRRFLL
 */
export function parseInput(input: string): ParsedInput {
	// Handle null/undefined/empty input
	if (!input || input.trim().length === 0) {
		throw new Error("Input must contain at least grid bounds");
	}

	const lines = input
		.trim()
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	if (lines.length < 1) {
		throw new Error("Input must contain at least grid bounds");
	}

	// Check if input is single-line format (space-separated)
	const isSingleLine = lines.length === 1;

	let gridLine: string;
	let robotTokens: string[];

	if (isSingleLine) {
		// Single-line format: "5 3 1 1 E RFRFRFRF 3 2 N FRRFLLFFRRFLL"
		const firstLine = lines[0];
		if (!firstLine) {
			throw new Error("Input must contain at least grid bounds");
		}
		const allTokens = firstLine.split(/\s+/);
		if (allTokens.length < 2) {
			throw new Error("Input must contain at least grid bounds");
		}
		gridLine = `${allTokens[0]} ${allTokens[1]}`;
		robotTokens = allTokens.slice(2);
	} else {
		// Multi-line format: traditional line-by-line
		const firstLine = lines[0];
		if (!firstLine) {
			throw new Error("Grid line not found in input");
		}
		gridLine = firstLine;
		robotTokens = lines.slice(1).flatMap((line) => line.split(/\s+/));
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

	// Parse robot definitions from tokens
	const robotDefinitions: RobotDefinition[] = [];

	// Each robot needs: x y orientation instructions (4 tokens minimum)
	if (robotTokens.length % 4 !== 0) {
		throw new Error(
			"Invalid robot format. Each robot must have: x y orientation instructions",
		);
	}

	for (let i = 0; i < robotTokens.length; i += 4) {
		const xStr = robotTokens[i];
		const yStr = robotTokens[i + 1];
		const orientationStr = robotTokens[i + 2];
		const instructions = robotTokens[i + 3];

		if (!xStr || !yStr || !orientationStr || !instructions) {
			throw new Error(`Missing robot data at position ${i / 4 + 1}`);
		}

		const x = Number.parseInt(xStr, 10);
		const y = Number.parseInt(yStr, 10);

		if (Number.isNaN(x) || Number.isNaN(y)) {
			throw new Error(
				`Invalid robot coordinates: "${xStr} ${yStr}". x and y must be numbers`,
			);
		}

		if (x < 0 || y < 0) {
			throw new Error(
				`Invalid robot position: "${xStr} ${yStr} ${orientationStr}". Coordinates must be non-negative`,
			);
		}

		if (x > gridBounds.maxX || y > gridBounds.maxY) {
			throw new Error(
				`Invalid robot position: "${xStr} ${yStr} ${orientationStr}". Robot starts outside grid bounds`,
			);
		}

		if (!isValidOrientation(orientationStr)) {
			throw new Error(
				`Invalid robot orientation: "${orientationStr}". Must be N, S, E, or W`,
			);
		}

		// Validate instructions
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
