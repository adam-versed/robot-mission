import type { GridVisualizationRobot } from "@/lib/types";

interface RobotIconProps {
	robot: GridVisualizationRobot;
}

export function RobotIcon({ robot }: RobotIconProps) {
	// Get directional arrow based on orientation
	const getDirectionArrow = (orientation: string): string => {
		switch (orientation) {
			case "N":
				return "↑";
			case "E":
				return "→";
			case "S":
				return "↓";
			case "W":
				return "←";
			default:
				return "•";
		}
	};

	// Get rotation for robot icon based on orientation
	const getRotation = (orientation: string): string => {
		switch (orientation) {
			case "N":
				return "rotate-0";
			case "E":
				return "rotate-90";
			case "S":
				return "rotate-180";
			case "W":
				return "-rotate-90";
			default:
				return "rotate-0";
		}
	};

	const arrow = getDirectionArrow(robot.orientation);
	const rotation = getRotation(robot.orientation);
	const robotNumber = robot.id.replace("robot-", "");

	return (
		<div className="flex flex-col items-center justify-center space-y-0.5">
			{/* Robot body */}
			<div
				className={`flex h-4 w-4 transform items-center justify-center rounded-sm border-2 font-bold text-[10px] transition-transform sm:h-5 sm:w-5 sm:text-xs ${rotation} ${
					robot.isLost
						? "border-red-300 bg-red-500 text-red-100"
						: "border-purple-300 bg-purple-500 text-purple-100"
				}`}
				title={`Robot ${robotNumber} facing ${robot.orientation}${robot.isLost ? " (LOST)" : ""}`}
			>
				{robotNumber}
			</div>

			{/* Direction arrow */}
			<div
				className={`text-sm leading-none sm:text-lg ${
					robot.isLost ? "text-red-400" : "text-purple-400"
				}`}
			>
				{arrow}
			</div>

			{/* Lost indicator */}
			{robot.isLost && (
				<div className="-top-1 -right-1 absolute flex h-3 w-3 items-center justify-center rounded-full border border-red-400 bg-red-600 text-white text-xs">
					!
				</div>
			)}
		</div>
	);
}
