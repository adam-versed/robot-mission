"use client";

import { GridVisualization } from "@/components/ui/GridVisualization";
import { SAMPLE_INPUT_RAW } from "@/data/sample-data";
import { formatMissionResults, processMission } from "@/lib/mission-processor";
import type { MissionVisualizationData } from "@/lib/types";
import { useState } from "react";

export default function Home() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [visualizationData, setVisualizationData] =
		useState<MissionVisualizationData | null>(null);
	const [hasInputError, setHasInputError] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setError("");
			setHasInputError(false);

			// Process the mission using existing domain logic
			const results = processMission(input);

			// Check if processing failed (empty results indicate an error occurred)
			if (results.textOutput.length === 0 && input.trim().length > 0) {
				throw new Error(
					"Invalid input format. Please check your input and try again.",
				);
			}

			const formattedOutput = formatMissionResults(results.textOutput);

			setOutput(formattedOutput);
			setVisualizationData(results.visualizationData);
		} catch (err) {
			// Format error message to be more user-friendly
			let errorMessage = "An error occurred";
			if (err instanceof Error) {
				errorMessage = err.message;

				// Make specific error messages more user-friendly
				if (errorMessage.includes("Must contain only L, R, F characters")) {
					errorMessage =
						"Invalid robot instructions. Commands must only contain:\n• L (turn left)\n• R (turn right)\n• F (move forward)";
				} else if (errorMessage.includes('Expected "maxX maxY"')) {
					errorMessage =
						"Invalid grid format. First line must be two numbers separated by a space (e.g., '5 3')";
				} else if (errorMessage.includes('Expected "x y orientation"')) {
					errorMessage =
						"Invalid robot position. Format must be 'x y orientation' where orientation is N, S, E, or W";
				} else if (errorMessage.includes("Robot starts outside grid bounds")) {
					errorMessage =
						"Robot starting position is outside the grid boundaries";
				}
			}

			setError(errorMessage);
			setOutput("");
			setVisualizationData(null);
			setHasInputError(true);

			// Clear the input error highlight after animation
			setTimeout(() => {
				setHasInputError(false);
			}, 2000);
		}
	};

	const handleClear = () => {
		setInput("");
		setOutput("");
		setError("");
		setVisualizationData(null);
		setHasInputError(false);
	};

	const handleLoadSample = () => {
		setInput(SAMPLE_INPUT_RAW);
		setOutput("");
		setError("");
		setVisualizationData(null);
		setHasInputError(false);
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="container flex flex-col items-center justify-center gap-8 px-4 py-8">
				<div className="text-center">
					<h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
						Mars <span className="text-[hsl(280,100%,70%)]">Mission</span>{" "}
						Control
					</h1>
					<p className="mt-4 max-w-2xl text-center text-xl">
						Mars Robot Mission Control System - Red Badger Coding Challenge
					</p>
				</div>

				<div className="w-full max-w-4xl">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="input" className="mb-2 block font-medium text-sm">
								Problem Input (Red Badger Format):
							</label>
							<textarea
								id="input"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="5 3&#10;1 1 E&#10;RFRFRFRF&#10;3 2 N&#10;FRRFLLFFRRFLL&#10;0 3 W&#10;LLFFFLFLFL"
								className={`h-48 w-full rounded-md border p-3 font-mono text-sm text-white placeholder-gray-400 transition-all duration-300 ${
									hasInputError
										? "animate-pulse border-red-500 bg-red-900/20 shadow-lg shadow-red-500/20"
										: "border-gray-600 bg-gray-800"
								}`}
								required
							/>
						</div>

						<div className="flex gap-4">
							<button
								type="submit"
								className="rounded-md bg-purple-600 px-6 py-2 font-medium transition-colors hover:bg-purple-700"
							>
								Process Robots
							</button>
							<button
								type="button"
								onClick={handleLoadSample}
								className="rounded-md bg-blue-600 px-6 py-2 font-medium transition-colors hover:bg-blue-700"
							>
								Load Sample Data
							</button>
							<button
								type="button"
								onClick={handleClear}
								className="rounded-md bg-gray-600 px-6 py-2 font-medium transition-colors hover:bg-gray-700"
							>
								Clear
							</button>
						</div>
					</form>

					{error && (
						<div className="mt-4 rounded-md border-2 border-red-600 bg-red-900/50 p-4">
							<div className="flex items-start space-x-2">
								<span className="text-red-400 text-xl">⚠️</span>
								<div className="flex-1">
									<h3 className="mb-1 font-semibold text-red-200">Error</h3>
									<p className="whitespace-pre-line text-red-300">{error}</p>
								</div>
							</div>
						</div>
					)}

					{output && (
						<div className="mt-4 space-y-6">
							<h3 className="mb-2 font-medium text-lg">Results:</h3>

							{/* Grid Visualization */}
							{visualizationData && (
								<GridVisualization data={visualizationData} />
							)}

							{/* Text Output */}
							<div>
								<h4 className="mb-2 font-medium text-base text-gray-300">
									Text Output:
								</h4>
								<pre className="whitespace-pre-wrap rounded-md border border-gray-600 bg-gray-800 p-4 font-mono text-sm">
									{output}
								</pre>
							</div>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
