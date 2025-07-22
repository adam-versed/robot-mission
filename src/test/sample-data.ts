/**
 * Sample test data from Red Badger coding challenge
 * This is the MANDATORY sample data that must be used for testing
 */

export const SAMPLE_INPUT_RAW = `5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL`;

export const SAMPLE_OUTPUT_RAW = `1 1 E
3 3 N LOST
2 3 S`;

/**
 * Parsed sample data for testing
 */
export const SAMPLE_DATA = {
	grid: {
		maxX: 5,
		maxY: 3,
	},
	robots: [
		{
			startPosition: { x: 1, y: 1 },
			startOrientation: "E" as const,
			instructions: "RFRFRFRF",
			expectedFinalPosition: { x: 1, y: 1 },
			expectedFinalOrientation: "E" as const,
			expectedIsLost: false,
			expectedOutput: "1 1 E",
		},
		{
			startPosition: { x: 3, y: 2 },
			startOrientation: "N" as const,
			instructions: "FRRFLLFFRRFLL",
			expectedFinalPosition: { x: 3, y: 3 },
			expectedFinalOrientation: "N" as const,
			expectedIsLost: true,
			expectedOutput: "3 3 N LOST",
		},
		{
			startPosition: { x: 0, y: 3 },
			startOrientation: "W" as const,
			instructions: "LLFFFLFLFL",
			expectedFinalPosition: { x: 2, y: 3 },
			expectedFinalOrientation: "S" as const,
			expectedIsLost: false,
			expectedOutput: "2 3 S",
		},
	],
	expectedOutputs: ["1 1 E", "3 3 N LOST", "2 3 S"],
} as const;

/**
 * Additional test scenarios for edge cases
 */
export const EDGE_CASE_DATA = {
	// Robot starting at origin
	originRobot: {
		startPosition: { x: 0, y: 0 },
		startOrientation: "N" as const,
		instructions: "F",
		gridBounds: { maxX: 1, maxY: 1 },
	},
	// Robot starting at max coordinates
	maxPositionRobot: {
		startPosition: { x: 5, y: 3 },
		startOrientation: "N" as const,
		instructions: "F",
		gridBounds: { maxX: 5, maxY: 3 },
	},
	// Empty instruction string
	noInstructions: {
		startPosition: { x: 2, y: 2 },
		startOrientation: "N" as const,
		instructions: "",
		gridBounds: { maxX: 5, maxY: 3 },
	},
	// Long instruction string (but under 100 characters)
	longInstructions: {
		startPosition: { x: 2, y: 2 },
		startOrientation: "N" as const,
		instructions:
			"LRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLRLR",
		gridBounds: { maxX: 5, maxY: 3 },
	},
} as const;

/**
 * Boundary testing data
 */
export const BOUNDARY_TEST_DATA = {
	// Test all boundary edges
	northBoundary: {
		position: { x: 2, y: 3 },
		orientation: "N" as const,
		instructions: "F",
		gridBounds: { maxX: 5, maxY: 3 },
		shouldBeLost: true,
	},
	eastBoundary: {
		position: { x: 5, y: 2 },
		orientation: "E" as const,
		instructions: "F",
		gridBounds: { maxX: 5, maxY: 3 },
		shouldBeLost: true,
	},
	southBoundary: {
		position: { x: 2, y: 0 },
		orientation: "S" as const,
		instructions: "F",
		gridBounds: { maxX: 5, maxY: 3 },
		shouldBeLost: true,
	},
	westBoundary: {
		position: { x: 0, y: 2 },
		orientation: "W" as const,
		instructions: "F",
		gridBounds: { maxX: 5, maxY: 3 },
		shouldBeLost: true,
	},
} as const;
