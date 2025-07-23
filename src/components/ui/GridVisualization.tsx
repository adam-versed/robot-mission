import type { MissionVisualizationData } from "@/lib/types";
import { GridCell } from "./GridCell";
import { Legend } from "./Legend";

interface GridVisualizationProps {
	data: MissionVisualizationData;
}

export function GridVisualization({ data }: GridVisualizationProps) {
	const { bounds, robots, scentedPositions } = data;

	// Create grid cells (y inverted for CSS grid - top to bottom)
	const cells = [];
	for (let y = bounds.maxY; y >= 0; y--) {
		for (let x = 0; x <= bounds.maxX; x++) {
			const robot = robots.find(
				(r) => r.finalPosition.x === x && r.finalPosition.y === y,
			);
			const isScented = scentedPositions.some(
				(pos) => pos.x === x && pos.y === y,
			);

			cells.push(
				<GridCell
					key={`${x}-${y}`}
					x={x}
					y={y}
					robot={robot}
					isScented={isScented}
				/>,
			);
		}
	}

	const gridCols = bounds.maxX + 1;
	const gridRows = bounds.maxY + 1;

	// Create coordinate arrays to avoid array indices
	const xCoordinates = Array.from({ length: gridCols }, (_, i) => i);
	const yCoordinates = Array.from(
		{ length: gridRows },
		(_, i) => bounds.maxY - i,
	);

	return (
		<div className="space-y-4">
			<h3 className="font-semibold text-lg text-white">Grid Visualization</h3>

			<div className="w-full overflow-x-auto pb-4">
				<div className="flex min-w-fit flex-col items-center space-y-4">
					{/* Y-axis labels (top) */}
					<div
						className="grid gap-1 text-center text-gray-400 text-xs sm:text-sm"
						style={{
							gridTemplateColumns: `1.5rem repeat(${gridCols}, minmax(2rem, 2.5rem))`,
						}}
					>
						<div />
						{xCoordinates.map((xValue) => (
							<div key={`header-col-${xValue}`}>{xValue}</div>
						))}
					</div>

					{/* Main grid with Y-axis labels */}
					<div className="flex items-center space-x-2">
						{/* Y-axis labels (left) */}
						<div
							className="grid gap-1 text-center text-gray-400 text-xs sm:text-sm"
							style={{
								gridTemplateRows: `repeat(${gridRows}, minmax(2rem, 2.5rem))`,
							}}
						>
							{yCoordinates.map((yValue) => (
								<div
									key={`label-y-${yValue}`}
									className="flex items-center justify-center"
								>
									{yValue}
								</div>
							))}
						</div>

						{/* Grid */}
						<div
							className="grid gap-0.5 rounded-lg border border-gray-600 bg-gray-800/50 p-1 sm:gap-1 sm:p-2"
							style={{
								gridTemplateColumns: `repeat(${gridCols}, minmax(2rem, 2.5rem))`,
								gridTemplateRows: `repeat(${gridRows}, minmax(2rem, 2.5rem))`,
							}}
						>
							{cells}
						</div>
					</div>
				</div>
			</div>

			<Legend />
		</div>
	);
}
