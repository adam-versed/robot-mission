import { GridConfig } from "@/lib/config/GridConfig";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("GridConfig", () => {
	describe("Environment Variable Tests", () => {
		it("loads default value (50) when no env var set", () => {
			// Arrange & Act
			const gridConfig = new GridConfig();
			const maxCoordinate = gridConfig.getMaxCoordinate();

			// Assert
			expect(maxCoordinate).toBe(50);
		});

		it("falls back to default for invalid env var values", () => {
			// Arrange
			const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
			const originalEnv = process.env.MAX_GRID_COORDINATE;
			process.env.MAX_GRID_COORDINATE = "invalid";

			// Act
			const gridConfig = new GridConfig();
			const maxCoordinate = gridConfig.getMaxCoordinate();

			// Assert
			expect(maxCoordinate).toBe(50);
			expect(consoleSpy).toHaveBeenCalledWith(
				'Invalid MAX_GRID_COORDINATE value: "invalid". Using default value 50.',
			);

			// Cleanup
			if (originalEnv !== undefined) {
				process.env.MAX_GRID_COORDINATE = originalEnv;
			} else {
				process.env.MAX_GRID_COORDINATE = undefined;
			}
			consoleSpy.mockRestore();
		});
	});

	afterEach(() => {
		// Clean up any environment variable changes
		if (process.env.MAX_GRID_COORDINATE === "invalid") {
			process.env.MAX_GRID_COORDINATE = undefined;
		}
	});
});
