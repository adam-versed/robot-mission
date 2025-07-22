import { HydrateClient } from "@/trpc/server";

export default function Home() {
	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
				<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
					<h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
						Mars <span className="text-[hsl(280,100%,70%)]">Mission</span>{" "}
						Control
					</h1>
					<p className="max-w-2xl text-center text-xl">
						Welcome to the Mars Mission Control System. Manage robot
						deployments, execute exploration missions, and track the status of
						your Mars fleet.
					</p>
				</div>
			</main>
		</HydrateClient>
	);
}
