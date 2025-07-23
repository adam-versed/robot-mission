"use client";

import { formatMissionResults, processMission } from "@/lib/mission-processor";
import { SAMPLE_INPUT_RAW } from "@/test/sample-data";
import { useState } from "react";

export default function Home() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setError("");

			// Process the mission using existing domain logic
			const results = processMission(input);
			const formattedOutput = formatMissionResults(results);

			setOutput(formattedOutput);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			setOutput("");
		}
	};

	const handleClear = () => {
		setInput("");
		setOutput("");
		setError("");
	};

	const handleLoadSample = () => {
		setInput(SAMPLE_INPUT_RAW);
		setOutput("");
		setError("");
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
								className="h-48 w-full rounded-md border border-gray-600 bg-gray-800 p-3 font-mono text-sm text-white placeholder-gray-400"
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
						<div className="mt-4 rounded-md border border-red-700 bg-red-900 p-4">
							<h3 className="font-medium text-red-200">Error:</h3>
							<p className="text-red-300">{error}</p>
						</div>
					)}

					{output && (
						<div className="mt-4">
							<h3 className="mb-2 font-medium text-lg">Output:</h3>
							<pre className="whitespace-pre-wrap rounded-md border border-gray-600 bg-gray-800 p-4 font-mono text-sm">
								{output}
							</pre>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
