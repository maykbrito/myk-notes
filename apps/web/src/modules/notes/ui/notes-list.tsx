import { api } from "@myk-notes/backend/convex/_generated/api";
import type { Id } from "@myk-notes/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { FileText, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getNoteTitle } from "../functions/get-note-title";
import { Item } from "./item";

interface NotesListProps {
	parentId?: Id<"notes">;
	level?: number;
	onSelectNote: (id: Id<"notes"> | null) => void;
}
export function NotesList({
	parentId,
	level = 0,
	onSelectNote,
}: NotesListProps) {
	const [expanded, setExpanded] = useState<Record<string, boolean>>({});

	const handleExpanded = (noteId: string) => {
		setExpanded((prev) => ({
			...prev,
			[noteId]: !prev[noteId],
		}));
	};

	const notes = useQuery(api.notes.getSidebar, { parentId });
	const createNote = useMutation(api.notes.upsert);
	const archiveNote = useMutation(api.notes.archive);

	const handleCreate = (parentId?: Id<"notes">) => {
		const promise = createNote({
			parentId,
			content: JSON.stringify([
				{
					type: "heading",
					content: [
						{
							type: "text",
							text: "New Note",
						},
					],
				},
			]),
		});

		toast.promise(promise, {
			loading: "Creating note...",
			success: "Note created",
			error: "Failed to create note",
		});

		if (!expanded[parentId as string]) {
			handleExpanded(parentId as string);
		}

		promise.then((noteId) => {
			onSelectNote(noteId);
		});
	};

	const handleArchive = (noteId: Id<"notes">) => {
		if (!noteId) return;

		const promise = archiveNote({ id: noteId });

		toast.promise(promise, {
			loading: "Archiving note...",
			success: "Note archived",
			error: "Failed to archive note",
		});

		promise.then(() => onSelectNote(null));
	};

	if (notes === undefined) {
		return (
			<div className="space-y-2">
				<Item.Skeleton level={level} />
				{level === 0 && (
					<>
						<Item.Skeleton level={level} />
						<Item.Skeleton level={level} />
					</>
				)}
			</div>
		);
	}

	return (
		<>
			{level === 0 && (
				<Item
					onClick={() => handleCreate()}
					icon={PlusCircle}
					label="Create new note"
				/>
			)}
			<p
				style={{ paddingLeft: level ? `${level * 20 + 24}px` : "24px" }}
				className={cn(
					"hidden text-sm font-medium text-muted-foreground/80",
					expanded && "last:block",
					level === 0 && "hidden",
				)}
			>
				No notes found.
			</p>
			{notes.length > 0 &&
				notes.toReversed().map((note) => (
					<div key={note._id}>
						<Item
							id={note._id}
							onClick={() => onSelectNote(note._id)}
							icon={FileText}
							label={getNoteTitle(note.content) as string}
							level={level}
							expanded={expanded[note._id]}
							onExpand={() => handleExpanded(note._id)}
							onCreate={() => handleCreate(note._id)}
							onArchive={() => handleArchive(note._id)}
						/>
						{expanded[note._id] && (
							<NotesList
								parentId={note._id}
								level={level + 1}
								onSelectNote={onSelectNote}
							/>
						)}
					</div>
				))}
		</>
	);
}
