import { Hash } from "lucide-react";
import { useEffect } from "react";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { ctx } from "../../functions/context";
import { removeAddClasses } from "../../functions/remove-add-classes";

export function RotateBg() {
	const pluginName = "rotate-bg";
	const data = {
		container: "#patterns",
		bgs: new Map([
			// https://hillmann.cc/tailwindcss-bg-patterns/
			[
				"boxes",
				"pattern-boxes pattern-gray-400 dark:pattern-gray-900 pattern-bg-transparent pattern-size-2 pattern-opacity-20",
			],
			[
				"dots",
				"pattern-dots pattern-gray-500 dark:pattern-gray-800 pattern-bg-white dark:pattern-bg-black pattern-size-2 pattern-opacity-20",
			],
			["none", ""],
		]),
	};

	/* first load*/
	useEffect(() => {
		const bgs = data.bgs;
		const currentBg = ctx.read(`${pluginName}-bg`) || "dotted";
		const container = ctx.query(data.container);
		if (container) {
			removeAddClasses(container, [...bgs.values()], bgs.get(currentBg) || "");
		}
	}, [data.bgs, data.container]);

	/* action */
	const handleRotateBg = () => {
		const bgs = data.bgs;

		const currentBg = ctx.read(`${pluginName}-bg`) || "dotted";

		const currentBgIndex = [...bgs.keys()].indexOf(currentBg);
		const nextBg = [...bgs.keys()][(currentBgIndex + 1) % bgs.size];
		ctx.persist(`${pluginName}-bg`, nextBg);

		const container = ctx.query(data.container);
		if (container) {
			removeAddClasses(container, [...bgs.values()], bgs.get(nextBg) || "");
		}
	};

	return (
		<Hint text="Rotate background" side="right">
			<Button
				onClick={handleRotateBg}
				variant="ghost"
				size="sm"
				className="size-6"
			>
				<Hash />
			</Button>
		</Hint>
	);
}
