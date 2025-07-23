import { DirectionSystem } from "@/lib/direction/DirectionSystem";
import { beforeEach, describe, expect, test } from "vitest";

describe("DirectionSystem", () => {
	let directionSystem: DirectionSystem;

	beforeEach(() => {
		directionSystem = new DirectionSystem();
		// Each test gets a fresh instance, no need to clear
	});

	describe("Core Registration Tests", () => {
		test("register() adds new direction with correct vector calculation", () => {
			// Arrange & Act
			directionSystem.register("NE", 45);

			// Assert
			const vector = directionSystem.getMovementVector("NE");
			// NE at 45° should have vector [sin(45°), cos(45°)] = [0.707, 0.707]
			expect(vector[0]).toBeCloseTo(Math.SQRT1_2, 3);
			expect(vector[1]).toBeCloseTo(Math.SQRT1_2, 3);
		});

		test("getRegisteredDirections() returns sorted direction names", () => {
			// Arrange
			directionSystem.register("S", 180);
			directionSystem.register("N", 0);
			directionSystem.register("E", 90);
			directionSystem.register("W", 270);

			// Act
			const directions = directionSystem.getRegisteredDirections();

			// Assert
			expect(directions).toEqual(["E", "N", "S", "W"]);
		});

		test("clear() removes all registered directions", () => {
			// Arrange
			directionSystem.register("N", 0);
			directionSystem.register("E", 90);
			expect(directionSystem.getRegisteredDirections()).toHaveLength(2);

			// Act
			directionSystem.clear();

			// Assert
			expect(directionSystem.getRegisteredDirections()).toHaveLength(0);
			expect(directionSystem.getRegisteredDirections()).toEqual([]);
		});
	});

	describe("Turn Logic Tests", () => {
		test("turn() finds closest registered direction", () => {
			// Arrange
			directionSystem.register("N", 0);
			directionSystem.register("E", 90);

			// Act - Turn 45° from North should find closest direction (North at 0° is closer than East at 90°)
			const result = directionSystem.turn("N", 45);

			// Assert
			expect(result).toBe("N");
		});
	});

	describe("Error Handling Tests", () => {
		test("turn() throws error for unregistered current direction", () => {
			// Arrange
			directionSystem.register("N", 0);

			// Act & Assert
			expect(() => {
				directionSystem.turn("INVALID", 90);
			}).toThrow("Current direction 'INVALID' is not registered");
		});

		test("getMovementVector() throws error for unregistered direction", () => {
			// Arrange
			directionSystem.register("N", 0);
			directionSystem.register("E", 90);

			// Act & Assert
			expect(() => {
				directionSystem.getMovementVector("INVALID");
			}).toThrow(
				"Direction 'INVALID' is not registered. Available directions: E, N",
			);
		});
	});
});
