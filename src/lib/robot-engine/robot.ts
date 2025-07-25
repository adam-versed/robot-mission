import type { DirectionSystem } from "@/lib/direction/DirectionSystem";
import type {
	Command,
	Grid,
	Orientation,
	RobotPosition,
	RobotState,
} from "@/lib/types";

/**
 * Mars Robot implementation
 * Handles movement, orientation changes, and boundary detection
 */
export class MarsRobot {
	private _state: RobotState;
	private readonly _id: string;
	private readonly _name: string;

	constructor(
		id: string,
		name: string,
		initialPosition: RobotPosition,
		initialOrientation: Orientation,
		private readonly directionSystem: DirectionSystem,
	) {
		this._id = id;
		this._name = name;
		this._state = {
			position: { ...initialPosition },
			orientation: initialOrientation,
			isLost: false,
		};
	}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get state(): RobotState {
		return {
			position: { ...this._state.position },
			orientation: this._state.orientation,
			isLost: this._state.isLost,
		};
	}

	/**
	 * Process a single command (L, R, or F)
	 */
	processCommand(command: Command, grid: Grid): void {
		if (this._state.isLost) {
			return; // Lost robots don't process further commands
		}

		switch (command) {
			case "L":
				this._turnLeft();
				break;
			case "R":
				this._turnRight();
				break;
			case "F":
				this._moveForward(grid);
				break;
			default:
				throw new Error(`Invalid command: ${command}`);
		}
	}

	/**
	 * Process a sequence of commands
	 */
	processCommands(commands: string, grid: Grid): void {
		for (const commandChar of commands) {
			if (this._isValidCommand(commandChar)) {
				this.processCommand(commandChar as Command, grid);
			}

			// Stop processing if robot becomes lost
			if (this._state.isLost) {
				break;
			}
		}
	}

	/**
	 * Get the output string representation for final position
	 */
	getOutputString(): string {
		const { position, orientation, isLost } = this._state;
		const baseOutput = `${position.x} ${position.y} ${orientation}`;
		return isLost ? `${baseOutput} LOST` : baseOutput;
	}

	private _turnLeft(): void {
		this._state.orientation = this.directionSystem.turn(
			this._state.orientation,
			-90,
		) as Orientation;
	}

	private _turnRight(): void {
		this._state.orientation = this.directionSystem.turn(
			this._state.orientation,
			90,
		) as Orientation;
	}

	private _moveForward(grid: Grid): void {
		const [deltaX, deltaY] = this.directionSystem.getMovementVector(
			this._state.orientation,
		);
		const move = { x: deltaX, y: deltaY };
		const newPosition: RobotPosition = {
			x: this._state.position.x + move.x,
			y: this._state.position.y + move.y,
		};

		// Check if the new position would be off the grid
		if (!grid.isValidPosition(newPosition)) {
			// Check if current position has scent (protection from previous lost robot)
			if (grid.hasScent(this._state.position)) {
				// Ignore the command - scent protection
				return;
			}

			// Robot becomes lost - add scent at current position
			grid.addScent(this._state.position);
			this._state.isLost = true;
			return;
		}

		// Safe move
		this._state.position = newPosition;
	}

	private _isValidCommand(command: string): command is Command {
		return command === "L" || command === "R" || command === "F";
	}
}
