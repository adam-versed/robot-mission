import { MarsGrid } from "@/lib/grid/grid";
import type { RobotPosition } from "@/lib/types";
import { describe, expect, it } from "vitest";

describe("MarsGrid Class", () => {
	describe("Constructor and Properties", () => {
		it("should create grid with correct bounds", () => {
			// Arrange
			const bounds = { maxX: 5, maxY: 3 };

			// Act
			const grid = new MarsGrid(bounds);

			// Assert
			expect(grid.bounds).toEqual(bounds);
			expect(grid.bounds).not.toBe(bounds); // Should be a copy
		});

		it("should create grid with immutable bounds", () => {
			// Arrange
			const bounds = { maxX: 5, maxY: 3 };
			const grid = new MarsGrid(bounds);

			// Act
			const retrievedBounds = grid.bounds;
			retrievedBounds.maxX = 10; // Attempt to modify

			// Assert
			expect(grid.bounds.maxX).toBe(5); // Original bounds unchanged
		});
	});

	describe("Position Validation", () => {
		it("should validate positions within grid boundaries", () => {
			// Arrange
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });

			// Act & Assert - Valid positions
			expect(grid.isValidPosition({ x: 0, y: 0 })).toBe(true); // Origin
			expect(grid.isValidPosition({ x: 5, y: 3 })).toBe(true); // Max coordinates
			expect(grid.isValidPosition({ x: 2, y: 1 })).toBe(true); // Middle
			expect(grid.isValidPosition({ x: 0, y: 3 })).toBe(true); // Edge cases
			expect(grid.isValidPosition({ x: 5, y: 0 })).toBe(true);
		});

		it("should reject positions outside grid boundaries", () => {
			// Arrange
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });

			// Act & Assert - Invalid positions
			expect(grid.isValidPosition({ x: -1, y: 0 })).toBe(false); // Negative x
			expect(grid.isValidPosition({ x: 0, y: -1 })).toBe(false); // Negative y
			expect(grid.isValidPosition({ x: 6, y: 3 })).toBe(false); // x > maxX
			expect(grid.isValidPosition({ x: 5, y: 4 })).toBe(false); // y > maxY
			expect(grid.isValidPosition({ x: -1, y: -1 })).toBe(false); // Both negative
			expect(grid.isValidPosition({ x: 6, y: 4 })).toBe(false); // Both too large
		});

		it("should handle edge case grid sizes", () => {
			// Arrange - Single cell grid
			const singleCellGrid = new MarsGrid({ maxX: 0, maxY: 0 });

			// Act & Assert
			expect(singleCellGrid.isValidPosition({ x: 0, y: 0 })).toBe(true);
			expect(singleCellGrid.isValidPosition({ x: 1, y: 0 })).toBe(false);
			expect(singleCellGrid.isValidPosition({ x: 0, y: 1 })).toBe(false);
		});
	});

	describe("Scent Management", () => {
		it("should add and detect scents at positions", () => {
			// Arrange
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });
			const position: RobotPosition = { x: 3, y: 3 };

			// Act
			expect(grid.hasScent(position)).toBe(false); // Initially no scent
			grid.addScent(position);

			// Assert
			expect(grid.hasScent(position)).toBe(true);
		});

		it("should handle multiple scents at different positions", () => {
			// Arrange
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });
			const position1: RobotPosition = { x: 3, y: 3 };
			const position2: RobotPosition = { x: 5, y: 0 };
			const position3: RobotPosition = { x: 0, y: 2 };

			// Act
			grid.addScent(position1);
			grid.addScent(position2);

			// Assert
			expect(grid.hasScent(position1)).toBe(true);
			expect(grid.hasScent(position2)).toBe(true);
			expect(grid.hasScent(position3)).toBe(false); // No scent added here
		});

		it("should not duplicate scents at same position", () => {
			// Arrange
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });
			const position: RobotPosition = { x: 2, y: 2 };

			// Act
			grid.addScent(position);
			grid.addScent(position); // Add again

			// Assert
			const scentedPositions = grid.getScentedPositions();
			const matchingPositions = scentedPositions.filter(
				(p) => p.x === position.x && p.y === position.y,
			);
			expect(matchingPositions).toHaveLength(1); // Only one entry
		});

		it("should retrieve all scented positions correctly", () => {
			// Arrange
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });
			const positions: RobotPosition[] = [
				{ x: 1, y: 1 },
				{ x: 3, y: 3 },
				{ x: 0, y: 0 },
			];

			// Act
			for (const position of positions) {
				grid.addScent(position);
			}

			// Assert
			const scentedPositions = grid.getScentedPositions();
			expect(scentedPositions).toHaveLength(3);

			// Check each position is present (order may vary)
			for (const expectedPosition of positions) {
				const found = scentedPositions.some(
					(p) => p.x === expectedPosition.x && p.y === expectedPosition.y,
				);
				expect(found).toBe(true);
			}
		});

		it("should clear all scents", () => {
			// Arrange
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });
			const positions: RobotPosition[] = [
				{ x: 1, y: 1 },
				{ x: 3, y: 3 },
			];

			// Act
			for (const position of positions) {
				grid.addScent(position);
			}
			expect(grid.getScentedPositions()).toHaveLength(2); // Verify scents added

			grid.clearScents();

			// Assert
			expect(grid.getScentedPositions()).toHaveLength(0);
			for (const position of positions) {
				expect(grid.hasScent(position)).toBe(false);
			}
		});
	});

	describe("Edge Cases", () => {
		it("should handle scents at grid boundaries", () => {
			// Arrange
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });
			const boundaryPositions: RobotPosition[] = [
				{ x: 0, y: 0 }, // Bottom-left corner
				{ x: 5, y: 0 }, // Bottom-right corner
				{ x: 0, y: 3 }, // Top-left corner
				{ x: 5, y: 3 }, // Top-right corner
			];

			// Act & Assert
			for (const position of boundaryPositions) {
				grid.addScent(position);
				expect(grid.hasScent(position)).toBe(true);
			}

			expect(grid.getScentedPositions()).toHaveLength(4);
		});

		it("should handle scents outside grid boundaries", () => {
			// Arrange
			const grid = new MarsGrid({ maxX: 5, maxY: 3 });
			const outsidePosition: RobotPosition = { x: 6, y: 4 };

			// Act - Grid should still allow adding scents outside boundaries
			// (This represents where a robot became lost)
			grid.addScent(outsidePosition);

			// Assert
			expect(grid.hasScent(outsidePosition)).toBe(true);
			expect(grid.getScentedPositions()).toHaveLength(1);
		});
	});
});
