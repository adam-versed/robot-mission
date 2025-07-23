export interface GridLimits {
	readonly maxCoordinate: number;
	readonly minCoordinate: number;
}

export class GridConfig {
	private limits: GridLimits;

	constructor() {
		this.limits = this.loadConfiguration();
	}

	/**
	 * Get the current grid limits
	 */
	getLimits(): GridLimits {
		return this.limits;
	}

	/**
	 * Get the maximum coordinate value
	 */
	getMaxCoordinate(): number {
		return this.limits.maxCoordinate;
	}

	/**
	 * Get the minimum coordinate value
	 */
	getMinCoordinate(): number {
		return this.limits.minCoordinate;
	}

	/**
	 * Check if a coordinate value is within limits
	 */
	isValidCoordinate(value: number): boolean {
		return (
			value >= this.limits.minCoordinate && value <= this.limits.maxCoordinate
		);
	}

	/**
	 * Validate grid bounds against configured limits
	 */
	validateGridBounds(maxX: number, maxY: number): void {
		if (!this.isValidCoordinate(maxX)) {
			throw new Error(
				`Invalid grid bound: maxX=${maxX}. Must be between ${this.limits.minCoordinate} and ${this.limits.maxCoordinate}`,
			);
		}

		if (!this.isValidCoordinate(maxY)) {
			throw new Error(
				`Invalid grid bound: maxY=${maxY}. Must be between ${this.limits.minCoordinate} and ${this.limits.maxCoordinate}`,
			);
		}
	}

	/**
	 * Reset configuration (mainly for testing)
	 */
	reset(): void {
		this.limits = this.loadConfiguration();
	}

	private loadConfiguration(): GridLimits {
		// Get from environment variable
		const maxCoordinateStr = this.getEnvironmentVariable("MAX_GRID_COORDINATE");
		let maxCoordinate = 50; // Default value maintains backward compatibility

		if (maxCoordinateStr !== undefined && maxCoordinateStr !== "") {
			const parsed = Number.parseInt(maxCoordinateStr, 10);
			if (!Number.isNaN(parsed) && parsed > 0) {
				maxCoordinate = parsed;
			} else {
				console.warn(
					`Invalid MAX_GRID_COORDINATE value: "${maxCoordinateStr}". Using default value ${maxCoordinate}.`,
				);
			}
		}

		return {
			maxCoordinate,
			minCoordinate: 0, // Mars grid always starts at 0,0
		};
	}

	private getEnvironmentVariable(name: string): string | undefined {
		// Check both server-side and client-side environment variables
		if (typeof process !== "undefined" && process.env) {
			return process.env[name] || process.env[`NEXT_PUBLIC_${name}`];
		}
		return undefined;
	}
}
