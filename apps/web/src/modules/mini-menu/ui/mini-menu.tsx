import { ModeToggle } from "@/modules/mini-menu/ui/components/mode-toggle";
import { AlternatePadding } from "./components/alternate-padding";
import { ToggleSidebar } from "./components/toggle-sidebar";

export function MiniMenu() {
	return (
		<nav className="opacity-0 group-hover/sidebar:opacity-100 transition flex flex-col absolute z-50 top-1 right-[-2rem] space-y-1.5">
			<ToggleSidebar />
			<ModeToggle />
			<AlternatePadding />
		</nav>
	);
}
