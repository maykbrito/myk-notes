import { codeBlockOptions } from "@blocknote/code-block";
import {
	BlockNoteSchema,
	createCodeBlockSpec,
	defaultBlockSpecs,
} from "@blocknote/core";

// Our schema with block specs, which contain the configs and implementations for
// blocks that we want our editor to use.
export const schema = BlockNoteSchema.create({
	blockSpecs: {
		// Adds all default blocks.
		...defaultBlockSpecs,
		codeBlock: createCodeBlockSpec(codeBlockOptions),
	},
});
