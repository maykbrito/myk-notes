import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

export const fixUserIds = mutation({
	handler: async (ctx) => {
		const notes = await ctx.db.query("notes").collect();
		let notesFixed = 0;
		for (const note of notes) {
			if (note.userId?.includes("|")) {
				const correctId = note.userId.split("|")[0];
				await ctx.db.patch(note._id, { userId: correctId as Id<"users"> });
				notesFixed++;
			}
		}

		const files = await ctx.db.query("files").collect();
		let filesFixed = 0;
		for (const file of files) {
			if (file.author?.includes("|")) {
				const correctId = file.author.split("|")[0];
				await ctx.db.patch(file._id, { author: correctId as Id<"users"> });
				filesFixed++;
			}
		}

		return { notesFixed, filesFixed };
	},
});
