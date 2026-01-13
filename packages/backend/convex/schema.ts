import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	...authTables,
	notes: defineTable({
		content: v.string(),
		isArchived: v.optional(v.boolean()),
		isPublic: v.optional(v.boolean()),
		parentId: v.optional(v.id("notes")),
		slug: v.optional(v.string()),
		updatedAt: v.optional(v.float64()),
		userId: v.id("users"),
	})
		.index("by_user", ["userId"])
		.index("by_user_parent_updatedAt", ["userId", "parentId", "updatedAt"]),

	files: defineTable({
		storageId: v.id("_storage"),
		author: v.id("users"),
		format: v.string(),
	}).index("by_user", ["author"]),
});
