import type { GridBounds, RobotPosition } from "@/lib/types";

/**
 * Mars grid implementation
 * Manages boundaries, coordinate validation, and scent tracking
 */
export class MarsGrid {
	private readonly _bounds: GridBounds;
	private readonly _scents: Set<string>;

	constructor(bounds: GridBounds) {
		this._bounds = { ...bounds };
		this._scents = new Set<string>();
	}

	get bounds(): GridBounds {
		return { ...this._bounds };
	}

	/**
	 * Check if a position is valid (within grid boundaries)
	 */
	isValidPosition(position: RobotPosition): boolean {
		return (
			position.x >= 0 &&
			position.y >= 0 &&
			position.x <= this._bounds.maxX &&
			position.y <= this._bounds.maxY
		);
	}

	/**
	 * Add scent at a position where a robot became lost
	 */
	addScent(position: RobotPosition): void {
		const scentKey = `${position.x},${position.y}`;
		this._scents.add(scentKey);
	}

	/**
	 * Check if a position has scent (protection from previous lost robot)
	 */
	hasScent(position: RobotPosition): boolean {
		const scentKey = `${position.x},${position.y}`;
		return this._scents.has(scentKey);
	}

	/**
	 * Get all scented positions (for debugging/visualization)
	 */
	getScentedPositions(): RobotPosition[] {
		return Array.from(this._scents).map((scentKey) => {
			const [xStr, yStr] = scentKey.split(",");
			const x = Number(xStr);
			const y = Number(yStr);
			return { x, y };
		});
	}

	/**
	 * Clear all scents (for testing/reset)
	 */
	clearScents(): void {
		this._scents.clear();
	}
}
