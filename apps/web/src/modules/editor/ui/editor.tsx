import { BlockNoteView } from "@blocknote/mantine";
import type { Doc } from "@my-better-t-app/backend/convex/_generated/dataModel";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteEditor, type PartialBlock } from "@blocknote/core";
import { api } from "@my-better-t-app/backend/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { scheduleAfter } from "@/lib/timers";
import { schema } from "./schemas";

interface EditorProps {
	note: Doc<"notes">;
}

export function Editor({ note }: EditorProps) {
	const updateNote = useMutation(api.notes.upsert);
	const generateUploadUrl = useMutation(api.files.generateUploadUrl);
	const sendFile = useMutation(api.files.sendFile);
	const getFile = useMutation(api.files.getFile);
	// Uploads a file to convex.dev and returns the URL to the uploaded file.
	async function uploadFile(file: File) {
		const postUrl = await generateUploadUrl();
		const result = await fetch(postUrl, {
			method: "POST",
			headers: { "Content-Type": file.type },
			body: file,
		});

		const { storageId } = await result.json();
		// Step 3: Save the newly allocated storage id to the database
		await sendFile({ storageId, format: file.type });

		// Step 4: Get the file URL from the database
		const fileUrl = await getFile({ storageId });
		return fileUrl.url;
	}

	const [initialContent, setInitialContent] = useState<
		PartialBlock[] | undefined | "loading"
	>("loading");

	// Creates a new editor instance.
	// We use useMemo + createBlockNoteEditor instead of useCreateBlockNote so we
	// can delay the creation of the editor until the initial content is loaded.
	const editor = useMemo(() => {
		if (initialContent === "loading") {
			return undefined;
		}
		return BlockNoteEditor.create({
			initialContent,
			animations: false,
			schema,
			uploadFile,
		});
	}, [initialContent]);

	// Loads the previously stored editor contents.
	useEffect(() => {
		if (!note || initialContent !== "loading") return;
		const content = note?.content
			? (JSON.parse(note?.content) as PartialBlock[])
			: undefined;

		setInitialContent(content);
	}, [note, initialContent]);

	if (editor === undefined) {
		return "Loading editor...";
	}

	const handleSave = async (editor: BlockNoteEditor) => {
		const content = editor.document;

		scheduleAfter(`save-${note._id}`, 500, async () => {
			await updateNote({ noteId: note._id, content: JSON.stringify(content) });
		});
	};

	return (
		<BlockNoteView
			editor={editor}
			onChange={handleSave}
			className="h-full"
			data-theming-css-variables-demo
		/>
	);
}
