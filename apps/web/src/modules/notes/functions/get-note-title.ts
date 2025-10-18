/**
 * Extrai o título da nota a partir do conteúdo HTML do TipTap.
 * @param content O conteúdo da nota
 * @returns O título da nota
 */
export function getNoteTitle(content: string): string {
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = content;
	const title = tempDiv.textContent?.trim().substring(0, 45) || "Nova nota";
	return title;
}
