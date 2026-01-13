import { query } from "./_generated/server";
import { getUserId } from "./utils";

export const viewer = query({
	args: {},
	handler: async (ctx) => {
		try {
			const userId = await getUserId(ctx);
			return userId !== null ? ctx.db.get(userId) : null;
		} catch {
			return null;
		}
	},
});
