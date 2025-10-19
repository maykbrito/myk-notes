import { BlockNoteView } from "@blocknote/mantine";
import type { Doc } from "@myk-notes/backend/convex/_generated/dataModel";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import {
	BlockNoteEditor,
	filterSuggestionItems,
	type PartialBlock,
} from "@blocknote/core";
import { pt } from "@blocknote/core/locales";
import {
	FormattingToolbar,
	FormattingToolbarController,
	getDefaultReactSlashMenuItems,
	getFormattingToolbarItems,
	SuggestionMenuController,
} from "@blocknote/react";
import {
	AIMenuController,
	AIToolbarButton,
	createAIExtension,
	getAISlashMenuItems,
} from "@blocknote/xl-ai";
import { pt as aiPt } from "@blocknote/xl-ai/locales";
import { api } from "@myk-notes/backend/convex/_generated/api";
import { DefaultChatTransport } from "ai";
import { useMutation } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { scheduleAfter } from "@/lib/timers";
import { schema } from "./schemas";

interface EditorProps {
	note: Doc<"notes">;
}

const BASE_URL = import.meta.env.VITE_CONVEX_SITE_URL;

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
			dictionary: {
				...pt,
				ai: aiPt, // add default translations for the AI extension
			},
			extensions: [
				createAIExtension({
					// The ClientSideTransport is used so the client makes calls directly to `streamText`
					// (whereas normally in the Vercel AI SDK, the client makes calls to your server, which then calls these methods)
					// (see https://github.com/vercel/ai/issues/5140 for background info)
					transport: new DefaultChatTransport({
						// URL to your backend API, see example source in `packages/xl-ai-server/src/routes/regular.ts`
						api: `${BASE_URL}/api/chat`,
					}),
				}),
			],
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
			formattingToolbar={false}
			slashMenu={false}
		>
			{/* Add the AI Command menu to the editor */}
			<AIMenuController />

			{/* We disabled the default formatting toolbar with `formattingToolbar=false` 
        and replace it for one with an "AI button" (defined below). 
        (See "Formatting Toolbar" in docs)
        */}
			<FormattingToolbarWithAI />

			{/* We disabled the default SlashMenu with `slashMenu=false` 
        and replace it for one with an AI option (defined below). 
        (See "Suggestion Menus" in docs)
        */}
			<SuggestionMenuWithAI editor={editor} />
		</BlockNoteView>
	);
}

// Formatting toolbar with the `AIToolbarButton` added
function FormattingToolbarWithAI() {
	return (
		<FormattingToolbarController
			formattingToolbar={() => (
				<FormattingToolbar>
					{...getFormattingToolbarItems()}
					{/* Add the AI button */}
					<AIToolbarButton />
				</FormattingToolbar>
			)}
		/>
	);
}

// Slash menu with the AI option added
function SuggestionMenuWithAI(props: {
	editor: BlockNoteEditor<any, any, any>;
}) {
	return (
		<SuggestionMenuController
			triggerCharacter="/"
			getItems={async (query) =>
				filterSuggestionItems(
					[
						...getDefaultReactSlashMenuItems(props.editor),
						// add the default AI slash menu items, or define your own
						...getAISlashMenuItems(props.editor),
					],
					query,
				)
			}
		/>
	);
}
