import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./utils";

export const getSidebar = query({
	args: {
		parentId: v.optional(v.id("notes")),
	},

	handler: async (ctx, args) => {
		const userId = await getUserId(ctx);

		const notes = await ctx.db
			.query("notes")
			.withIndex("by_user_parent_updatedAt", (q) =>
				q.eq("userId", userId).eq("parentId", args.parentId),
			)
			.filter((q) => q.eq(q.field("isArchived"), false))
			.order("desc")
			.collect();

		return notes;
	},
});

export const get = query({
	args: {
		id: v.id("notes"),
	},
	handler: async (ctx, args) => {
		const userId = await getUserId(ctx);

		const [note] = await ctx.db
			.query("notes")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.filter((q) => q.eq(q.field("_id"), args.id))
			.take(1);

		return note;
	},
});

export const upsert = mutation({
	args: {
		content: v.string(),
		noteId: v.optional(v.id("notes")),
		parentId: v.optional(v.id("notes")),
	},
	handler: async (ctx, args) => {
		const userId = await getUserId(ctx);

		if (!args.content.trim()) {
			throw new Error("Content cannot be empty");
		}

		const [note] = await ctx.db
			.query("notes")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.filter((q) => q.eq(q.field("_id"), args.noteId))
			.take(1);

		if (note) {
			await ctx.db.patch(note._id, {
				content: args.content.trim(),
				updatedAt: Date.now(),
			});

			return note._id;
		}

		const noteId = await ctx.db.insert("notes", {
			content: args.content.trim(),
			userId,
			parentId: args.parentId,
			isArchived: false,
			updatedAt: Date.now(),
		});

		return noteId;
	},
});

export const archive = mutation({
	args: {
		id: v.id("notes"),
	},
	handler: async (ctx, args) => {
		const userId = await getUserId(ctx);

		if (!args.id) {
			throw new Error("Note ID is required");
		}

		const existingNote = await ctx.db.get(args.id);

		if (!existingNote) {
			throw new Error("Note not found");
		}

		if (existingNote.isArchived) {
			throw new Error("Note is already archived");
		}

		if (existingNote.userId !== userId) {
			throw new Error("User does not have permission to archive this note");
		}

		const recursiveArchive = async (noteId: Id<"notes">) => {
			const children = await ctx.db
				.query("notes")
				.withIndex("by_user_parent_updatedAt", (q) =>
					q.eq("userId", userId).eq("parentId", noteId),
				)
				.collect();

			for (const child of children) {
				await ctx.db.patch(child._id, {
					isArchived: true,
				});
				await recursiveArchive(child._id);
			}
		};

		const note = await ctx.db.patch(args.id, {
			isArchived: true,
		});

		recursiveArchive(args.id);

		return note;
	},
});

export const getTrash = query({
	handler: async (ctx) => {
		const userId = await getUserId(ctx);

		const notes = await ctx.db
			.query("notes")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.filter((q) => q.eq(q.field("isArchived"), true))
			.order("desc")
			.collect();

		return notes;
	},
});

export const restore = mutation({
	args: {
		noteId: v.id("notes"),
	},
	handler: async (ctx, args) => {
		const userId = await getUserId(ctx);

		if (!args.noteId) {
			throw new Error("Note ID is required");
		}

		const existingNote = await ctx.db.get(args.noteId);

		if (!existingNote) {
			throw new Error("Note not found");
		}

		if (existingNote.userId !== userId) {
			throw new Error("User does not have permission to restore this note");
		}

		const recursiveRestore = async (noteId: Id<"notes">) => {
			const children = await ctx.db
				.query("notes")
				.withIndex("by_user_parent_updatedAt", (q) =>
					q.eq("userId", userId).eq("parentId", noteId),
				)
				.collect();

			for (const child of children) {
				await ctx.db.patch(child._id, {
					isArchived: false,
				});
				await recursiveRestore(child._id);
			}
		};

		const options: Partial<Doc<"notes">> = {
			isArchived: false,
		};

		if (existingNote.parentId) {
			const parent = await ctx.db.get(existingNote.parentId);
			if (parent?.isArchived) {
				options.parentId = undefined;
			}
		}

		const note = await ctx.db.patch(args.noteId, options);

		recursiveRestore(args.noteId);

		return note;
	},
});

export const deleteNote = mutation({
	args: {
		noteId: v.id("notes"),
	},
	handler: async (ctx, args) => {
		const userId = await getUserId(ctx);

		if (!args.noteId) {
			throw new Error("Note ID is required");
		}

		const existingNote = await ctx.db.get(args.noteId);

		if (!existingNote) {
			throw new Error("Note not found");
		}

		if (existingNote.userId !== userId) {
			throw new Error("User does not have permission to delete this note");
		}

		await ctx.db.delete(existingNote._id);

		return { success: true };
	},
});
