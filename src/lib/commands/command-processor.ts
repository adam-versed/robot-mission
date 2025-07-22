import type { Command } from "@/lib/types";

/**
 * Command validation and processing utilities
 * Supports extensible command architecture for future expansion
 */

const VALID_COMMANDS: Set<string> = new Set(["L", "R", "F"]);

/**
 * Validate if a command is supported
 */
export function isValidCommand(command: string): command is Command {
	return VALID_COMMANDS.has(command);
}

/**
 * Validate a command string contains only valid commands
 */
export function validateCommandString(commands: string): boolean {
	if (commands.length === 0) {
		return true; // Empty commands are valid (robot doesn't move)
	}

	if (commands.length > 100) {
		return false; // Exceeds specification limit
	}

	for (const command of commands) {
		if (!isValidCommand(command)) {
			return false;
		}
	}

	return true;
}

/**
 * Filter out invalid commands from a command string
 */
export function filterValidCommands(commands: string): string {
	return commands
		.split("")
		.filter((cmd) => isValidCommand(cmd))
		.join("");
}

/**
 * Get all supported commands (for future extensibility)
 */
export function getSupportedCommands(): Command[] {
	return Array.from(VALID_COMMANDS) as Command[];
}
