/**
 * Core domain types for Mars Mission Control System
 * Based on Red Badger coding challenge specifications
 */

export type Orientation = "N" | "E" | "S" | "W";

export interface RobotPosition {
	x: number;
	y: number;
}

export interface GridBounds {
	maxX: number;
	maxY: number;
}

export interface RobotState {
	position: RobotPosition;
	orientation: Orientation;
	isLost: boolean;
}

export type Command = "L" | "R" | "F";

export interface Robot {
	id: string;
	name: string;
	state: RobotState;
	processCommand(command: Command): void;
	processCommands(commands: string): void;
	getOutputString(): string;
}

export interface Grid {
	bounds: GridBounds;
	isValidPosition(position: RobotPosition): boolean;
	addScent(position: RobotPosition): void;
	hasScent(position: RobotPosition): boolean;
}

export interface MissionContext {
	grid: Grid;
	robots: Robot[];
	processMission(input: string): string[];
}
