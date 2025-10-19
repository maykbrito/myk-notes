import { google } from "@ai-sdk/google";
import { toolDefinitionsToToolSet } from "@blocknote/xl-ai";
import { convertToModelMessages, streamText } from "ai";
import { httpAction } from "./_generated/server";

export const callAI = httpAction(async (ctx, request) => {
	const { messages, toolDefinitions } = await request.json();

	const model = google("gemini-2.5-flash");

	const result = await streamText({
		model,
		messages: convertToModelMessages(messages),
		tools: toolDefinitionsToToolSet(toolDefinitions),
		toolChoice: "required",
		headers: {
			"Access-Control-Allow-Origin": process.env.SITE_URL,
		},
	});

	return result.toUIMessageStreamResponse({
		headers: {
			"Access-Control-Allow-Origin": process.env.SITE_URL as string,
		},
	});
});
