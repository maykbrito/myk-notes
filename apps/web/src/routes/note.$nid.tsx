import { api } from "@myk-notes/backend/convex/_generated/api";
import type { Id } from "@myk-notes/backend/convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { Editor } from "@/modules/editor/ui/editor";

export const Route = createFileRoute("/note/$nid")({
	component: RouteComponent,
});

function RouteComponent() {
	const { nid } = Route.useParams();
	const note = useQuery(api.notes.get, { id: nid as Id<"notes"> });

	return (
		// biome-ignore lint/correctness/useUniqueElementIds: I wanna keep the same id for the editor container
		<div
			id="editor-container"
			className="h-full w-full relative"
			style={{ padding: "1rem calc(100vw - var(--editor-vw, 90vw))" }}
		>
			{!note ? "Loading note..." : <Editor note={note} />}
			{/** biome-ignore lint/correctness/useUniqueElementIds: I want to keep the id for this patterns div */}
			<div
				id="patterns"
				className="absolute inset-0 -z-0 pointer-events-none"
			/>
		</div>
	);
}
