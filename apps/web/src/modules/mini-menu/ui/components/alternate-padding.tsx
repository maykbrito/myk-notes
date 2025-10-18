import { ChevronsLeftRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { ctx } from "../../functions/context";

export function AlternatePadding() {
	const pluginName = "alternate-padding";
	const [currentPadding, setCurrentPadding] = useState("");

	useEffect(() => {
		const padding = ctx.read(`${pluginName}-padding`);
		if (padding) {
			setCurrentPadding(padding);
			ctx.setCssVar("--editor-vw", padding);
		}
	}, []);

	const handleAlternatePadding = () => {
		const min = 60;
		const max = 95;
		const step = 5;
		const curStr = currentPadding;
		const cur = curStr ? Number.parseInt(curStr, 10) : 85;
		const next = cur + step <= max ? cur + step : min;
		setCurrentPadding(`${next}vw`);
		ctx.setCssVar("--editor-vw", `${next}vw`);
		ctx.persist(`${pluginName}-padding`, `${next}vw`);
	};

	return (
		<Hint text="Alternate padding" side="right">
			<Button
				variant="ghost"
				size="sm"
				className="size-6"
				onClick={handleAlternatePadding}
			>
				<ChevronsLeftRight />
			</Button>
		</Hint>
	);
}
