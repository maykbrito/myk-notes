import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="flex items-center justify-center h-full">
			<div className="text-center">
				<h2 className="text-2xl font-semibold text-gray-900 mb-2 dark:text-white">
					Welcome back!
				</h2>
				<p className="text-gray-600 dark:text-gray-400">
					Select a document from the sidebar to start editing
				</p>
			</div>
		</div>
	);
}
