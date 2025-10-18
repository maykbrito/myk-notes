import type { Id } from "@my-better-t-app/backend/convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { NotesList } from "@/modules/notes/ui/notes-list";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	const [selectedDocumentId, setSelectedDocumentId] =
		useState<Id<"notes"> | null>(null);

	return (
		<>
			<Sidebar>
				<NotesList
					selectedNoteId={selectedDocumentId}
					onSelectNote={setSelectedDocumentId}
				/>
			</Sidebar>
			<div className="flex-1 flex flex-col overflow-y-auto bg-[color-mix(in_srgb,var(--color-primary)_5%,var(--color-bg)_100%)] relative">
				<div className="flex-1">
					{selectedDocumentId ? (
						"Editor"
					) : (
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
					)}
				</div>
			</div>
		</>
	);
}
