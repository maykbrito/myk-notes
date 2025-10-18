/**
 * Extrai o título da nota a partir do conteúdo JSON do Editor
 * @param content O conteúdo da nota
 * @returns O título da nota
 */
export function getNoteTitle(content: string): string {
	const firstBlock = JSON.parse(content)[0];
	const title =
		firstBlock.content?.[0]?.text?.trim().substring(0, 45) || "Untitled Note";
	return title;
}
