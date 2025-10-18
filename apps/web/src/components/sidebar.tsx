import type { ReactNode } from "react";
import { MiniMenu } from "@/modules/mini-menu/ui/mini-menu";

export function Sidebar({ children }: { children: ReactNode }) {
	return (
		<aside className="sidebar group/sidebar relative z-10 w-[250px] border-r border-gray-300 dark:border-gray-800 flex flex-col h-full">
			<nav className="flex-1 overflow-y-auto">
				<div className="pt-2" />
				{children}
			</nav>
			<MiniMenu />
		</aside>
	);
}
