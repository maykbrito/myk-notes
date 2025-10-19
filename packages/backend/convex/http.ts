import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { callAI } from "./httpActions";

const http = httpRouter();

http.route({
	path: "/api/chat",
	method: "POST",
	handler: callAI,
});

http.route({
	path: "/api/chat",
	method: "OPTIONS",
	handler: httpAction(async (_, request) => {
		// Make sure the necessary headers are present
		// for this to be a valid pre-flight request
		const headers = request.headers;
		if (
			headers.get("Origin") !== null &&
			headers.get("Access-Control-Request-Method") !== null &&
			headers.get("Access-Control-Request-Headers") !== null
		) {
			return new Response(null, {
				headers: new Headers({
					// e.g. https://mywebsite.com, configured on your Convex dashboard
					"Access-Control-Allow-Origin": process.env.SITE_URL as string,
					"Access-Control-Allow-Methods": "POST",
					"Access-Control-Allow-Headers": "Content-Type, Digest",
					"Access-Control-Max-Age": "86400",
				}),
			});
		}
		return new Response();
	}),
});

auth.addHttpRoutes(http);

export default http;
