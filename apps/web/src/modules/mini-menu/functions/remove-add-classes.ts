export const removeAddClasses = (
	element: Element,
	removeClasses: string[],
	addClasses: string,
) => {
	if (!element || !removeClasses.length) return;

	for (const bg of removeClasses) {
		for (const cls of bg.split(" ")) {
			if (!cls) continue;
			element.classList.remove(cls);
		}
	}
	const classes = addClasses.split(" ");

	for (const cls of classes) {
		if (!cls) continue;
		element.classList.add(cls);
	}
};
