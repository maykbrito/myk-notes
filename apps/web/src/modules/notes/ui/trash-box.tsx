import { api } from "@myk-notes/backend/convex/_generated/api";
import type { Id } from "@myk-notes/backend/convex/_generated/dataModel";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getNoteTitle } from "../functions/get-note-title";

export function TrashBox() {
	const navigate = useNavigate();
	const matchRoute = useMatchRoute();

	const notes = useQuery(api.notes.getTrash);
	const restore = useMutation(api.notes.restore);
	const deletePermanently = useMutation(api.notes.deleteNote);

	const [search, setSearch] = useState("");

	const filteredNotes = notes?.filter((note) => {
		const noteTitle = getNoteTitle(note.content);
		return noteTitle.toLowerCase().includes(search.toLowerCase());
	});

	const handleClick = (noteId: Id<"notes">) => {
		navigate({
			to: "/note/$nid",
			params: { nid: noteId },
		});
	};

	const handleRestore = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent,
		noteId: Id<"notes">,
	) => {
		event.stopPropagation();
		const promise = restore({ noteId });

		toast.promise(promise, {
			loading: "Restoring note...",
			success: "Note restored successfully",
			error: "Failed to restore note",
		});
	};

	const handleDeletePermanently = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent,
		noteId: Id<"notes">,
	) => {
		event.stopPropagation();

		const confirm = window.confirm(
			"Are you sure you want to delete this note permanently?",
		);

		if (!confirm) {
			return;
		}

		const promise = deletePermanently({ noteId });

		toast.promise(promise, {
			loading: "Deleting note...",
			success: "Note deleted successfully",
			error: "Failed to delete note",
		});

		// Check if current route matches the deleted note’s id; if so, navigate home
		const isCurrentRoute = matchRoute({
			to: "/note/$nid",
			params: { nid: noteId },
		});

		if (isCurrentRoute) {
			console.log("isCurrentRoute", isCurrentRoute);
			navigate({ to: "/" });
		}
	};

	if (!notes) {
		return (
			<div className="h-full flex items-center justify-center p-4">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="text-sm">
			<div className="flex items-center gap-x-1 p-2">
				<Search className="size-4" />
				<Input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="h-7 px-2 focus-visible:ring-transparent bg-secondary border-none"
					placeholder="Search notes"
				/>
			</div>
			<div className="mt-2 px-2 pb-2">
				<p className="text-muted-foreground px-2 pb-1.5">
					{filteredNotes?.length} notes found
				</p>
				{filteredNotes?.map((note) => (
					// biome-ignore lint/a11y/useSemanticElements: this is nested inside a button
					<div
						role="button"
						tabIndex={0}
						onClick={() => handleClick(note._id)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleClick(note._id);
							}
						}}
						key={note._id}
						className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
					>
						<span className="truncate w-full px-2 py-1.5 inline-block">
							{getNoteTitle(note.content)}
						</span>

						<div className="ml-auto flex items-center">
							{/** biome-ignore lint/a11y/useSemanticElements: this is nested inside a button */}
							<div
								role="button"
								tabIndex={0}
								onClick={(e) => handleRestore(e, note._id)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleRestore(e, note._id);
									}
								}}
								className="px-2 py-1.5 text-primary rounded-sm hover:bg-primary/5"
							>
								<Undo className="size-4" />
							</div>

							{/** biome-ignore lint/a11y/useSemanticElements: this is nested inside a button */}
							<div
								role="button"
								tabIndex={0}
								onClick={(e) => handleDeletePermanently(e, note._id)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleDeletePermanently(e, note._id);
									}
								}}
								className="px-2 py-1.5 text-primary rounded-sm hover:bg-primary/5"
							>
								<Trash className="size-4" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
