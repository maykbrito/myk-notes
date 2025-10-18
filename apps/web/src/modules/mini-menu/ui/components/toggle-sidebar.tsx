import { PanelLeft } from "lucide-react";
import { useEffect } from "react";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { ctx } from "../../functions/context";

export function ToggleSidebar() {
	const pluginName = "toggle-sidebar";

	useEffect(() => {
		const isClosed = ctx.read(`${pluginName}-close`) === "true";
		if (isClosed) {
			document.querySelector(".sidebar")?.classList.add("sidebar--closed");
		}
	}, []);

	const handleOpenCloseSidebar = () => {
		const sidebar = document.querySelector(".sidebar") as HTMLElement;
		sidebar.classList.toggle("sidebar--closed");
		ctx.persist(
			`${pluginName}-close`,
			sidebar?.classList.contains("sidebar--closed").toString(),
		);
	};

	return (
		<>
			<Hint text="Toggle sidebar" side="right">
				<Button
					onClick={handleOpenCloseSidebar}
					variant="ghost"
					size="sm"
					className="size-6"
				>
					<PanelLeft />
				</Button>
			</Hint>
			<style>
				{`
          .sidebar--closed {
            width: 0;
          }
        `}
			</style>
		</>
	);
}
