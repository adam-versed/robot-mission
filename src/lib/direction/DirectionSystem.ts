export interface DirectionDefinition {
	readonly name: string;
	readonly degrees: number;
	readonly vector: readonly [number, number];
}

export class DirectionSystem {
	private readonly directions = new Map<string, DirectionDefinition>();

	/**
	 * Register a new direction with the system
	 */
	register(name: string, degrees: number): void {
		// Validate direction name
		if (typeof name !== "string" || name.trim() === "") {
			throw new Error("Direction name must be a non-empty string");
		}

		const normalizedDegrees = this.normalizeDegrees(degrees);
		const radians = (normalizedDegrees * Math.PI) / 180;

		// Note: This system uses x = sin(angle), y = cos(angle) so that 0° points North (up),
		// which matches the grid's orientation for the Mars mission challenge. This is a 90°
		// rotation from the standard mathematical convention (x = cos, y = sin).
		const direction: DirectionDefinition = {
			name,
			degrees: normalizedDegrees,
			vector: [
				Math.round(Math.sin(radians) * 1000) / 1000, // x = sin(angle)
				Math.round(Math.cos(radians) * 1000) / 1000, // y = cos(angle)
			] as const,
		};

		this.directions.set(name, direction);
	}

	/**
	 * Check if a direction is registered
	 */
	isRegistered(name: string): boolean {
		return this.directions.has(name);
	}

	/**
	 * Get movement vector for a direction
	 */
	getMovementVector(name: string): readonly [number, number] {
		const direction = this.directions.get(name);
		if (!direction) {
			throw new Error(
				`Direction '${name}' is not registered. Available directions: ${this.getRegisteredDirections().join(
					", ",
				)}`,
			);
		}
		return direction.vector;
	}

	/**
	 * Turn from current direction by specified degrees
	 */
	turn(currentDirection: string, turnDegrees: number): string {
		const current = this.directions.get(currentDirection);
		if (!current) {
			throw new Error(
				`Current direction '${currentDirection}' is not registered`,
			);
		}

		const newDegrees = this.normalizeDegrees(current.degrees + turnDegrees);
		return this.findClosestDirection(newDegrees);
	}

	/**
	 * Get all registered direction names
	 */
	getRegisteredDirections(): string[] {
		return Array.from(this.directions.keys()).sort();
	}

	/**
	 * Get direction definition
	 */
	getDirection(name: string): DirectionDefinition | undefined {
		return this.directions.get(name);
	}

	/**
	 * Clear all registered directions (mainly for testing)
	 */
	clear(): void {
		this.directions.clear();
	}

	/**
	 * Initialize with default cardinal directions
	 */
	initializeDefaults(): void {
		this.register("N", 0); // North
		this.register("E", 90); // East
		this.register("S", 180); // South
		this.register("W", 270); // West
	}

	private normalizeDegrees(degrees: number): number {
		let normalized = degrees % 360;
		if (normalized < 0) {
			normalized += 360;
		}
		return normalized;
	}

	private findClosestDirection(targetDegrees: number): string {
		let closestDirection = "";
		let smallestDifference = Number.POSITIVE_INFINITY;

		for (const [name, direction] of this.directions) {
			const difference = this.calculateDegreeDifference(
				direction.degrees,
				targetDegrees,
			);
			if (difference < smallestDifference) {
				smallestDifference = difference;
				closestDirection = name;
			}
		}

		if (closestDirection === "") {
			throw new Error("No directions registered in the system");
		}

		return closestDirection;
	}

	private calculateDegreeDifference(deg1: number, deg2: number): number {
		const diff = Math.abs(deg1 - deg2);
		return Math.min(diff, 360 - diff);
	}
}
