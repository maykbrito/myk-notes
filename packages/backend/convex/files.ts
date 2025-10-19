import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
	handler: async (ctx) => {
		return await ctx.storage.generateUploadUrl();
	},
});

export const sendFile = mutation({
	args: { storageId: v.id("_storage"), format: v.string() },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error("Not authenticated");
		}

		await ctx.db.insert("files", {
			storageId: args.storageId,
			author: identity.subject,
			format: args.format.split("/")[0],
		});
	},
});

export const getFile = mutation({
	args: { storageId: v.id("_storage") },
	handler: async (ctx, args) => {
		const fileUrl = await ctx.storage.getUrl(args.storageId);

		if (!fileUrl) {
			throw new Error("File not found");
		}

		return {
			url: fileUrl,
		};
	},
});
