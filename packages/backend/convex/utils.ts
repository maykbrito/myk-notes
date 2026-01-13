import { getAuthUserId } from "@convex-dev/auth/server";
import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import type { DataModel, Id } from "./_generated/dataModel";

export async function getUserId(
	ctx: GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>,
): Promise<Id<"users">> {
	const userIdIdentity = await getAuthUserId(ctx);

	if (userIdIdentity === null) {
		throw new Error("Not authenticated");
	}

	return userIdIdentity.split("|")[0] as Id<"users">;
}
