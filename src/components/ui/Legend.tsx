export function Legend() {
	return (
		<div className="rounded-lg border border-gray-600 bg-gray-800/50 p-4">
			<h4 className="mb-3 font-semibold text-sm text-white">Legend</h4>

			<div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
				{/* Robot indicators */}
				<div className="space-y-2">
					<h5 className="font-medium text-purple-400">Robots</h5>

					<div className="flex items-center space-x-2">
						<div className="flex h-5 w-5 items-center justify-center rounded-sm border-2 border-purple-300 bg-purple-500 font-bold text-purple-100 text-xs">
							1
						</div>
						<span className="text-gray-300">Active Robot</span>
					</div>

					<div className="flex items-center space-x-2">
						<div className="flex h-5 w-5 items-center justify-center rounded-sm border-2 border-red-300 bg-red-500 font-bold text-red-100 text-xs">
							2
						</div>
						<span className="text-gray-300">Lost Robot</span>
					</div>

					<div className="flex items-center space-x-2">
						<span className="text-lg text-purple-400">↑→↓←</span>
						<span className="text-gray-300">Direction Facing</span>
					</div>
				</div>

				{/* Grid indicators */}
				<div className="space-y-2">
					<h5 className="font-medium text-red-400">Grid States</h5>

					<div className="flex items-center space-x-2">
						<div className="flex h-5 w-5 items-center justify-center border border-gray-600 bg-red-800/30">
							<span className="text-red-400 text-xs">⚠</span>
						</div>
						<span className="text-gray-300">Scented Position</span>
					</div>

					<div className="flex items-center space-x-2">
						<div className="h-5 w-5 border border-gray-600 bg-red-900/40" />
						<span className="text-gray-300">Robot + Scent</span>
					</div>

					<div className="flex items-center space-x-2">
						<div className="flex h-5 w-5 items-center justify-center border border-gray-600 bg-gray-800/20 text-gray-600 text-xs">
							0,0
						</div>
						<span className="text-gray-300">Empty Cell</span>
					</div>
				</div>
			</div>

			<div className="mt-3 border-gray-700 border-t pt-3">
				<p className="text-gray-400 text-xs">
					Scented positions prevent future robots from becoming lost at the same
					coordinates.
				</p>
			</div>
		</div>
	);
}
