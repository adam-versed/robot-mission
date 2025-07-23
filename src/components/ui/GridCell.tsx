import type { GridVisualizationRobot } from "@/lib/types";
import { RobotIcon } from "./RobotIcon";

interface GridCellProps {
	x: number;
	y: number;
	robot?: GridVisualizationRobot;
	isScented: boolean;
}

export function GridCell({ x, y, robot, isScented }: GridCellProps) {
	const cellClasses = [
		"border border-gray-600 flex items-center justify-center relative text-xs",
		"hover:bg-gray-700/50 transition-colors duration-200",
		"min-h-[2rem] min-w-[2rem] sm:min-h-[2.5rem] sm:min-w-[2.5rem]",
	];

	// Add background styling based on cell state
	if (isScented && robot) {
		// Cell has both scent and robot
		cellClasses.push("bg-red-900/40");
	} else if (isScented) {
		// Cell has scent only
		cellClasses.push("bg-red-800/30");
	} else if (robot) {
		// Cell has robot only
		cellClasses.push("bg-purple-800/30");
	} else {
		// Empty cell
		cellClasses.push("bg-gray-800/20");
	}

	return (
		<div
			className={cellClasses.join(" ")}
			title={`Position (${x}, ${y})${robot ? ` - ${robot.id}` : ""}${isScented ? " - Scented" : ""}`}
		>
			{robot && <RobotIcon robot={robot} />}
			{isScented && !robot && (
				<div className="font-bold text-red-400 text-xs">⚠</div>
			)}

			{/* Coordinate label for empty cells (subtle) */}
			{!robot && !isScented && (
				<div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs opacity-50">
					{x},{y}
				</div>
			)}
		</div>
	);
}
