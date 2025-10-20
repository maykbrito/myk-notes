import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MiniMenu } from "@/modules/mini-menu/ui/mini-menu";

export function Sidebar({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<aside
			className={cn(
				"sidebar group/sidebar relative z-10 w-[250px] border-r border-gray-300 dark:border-gray-800 flex flex-col h-full",
				className,
			)}
		>
			<nav className="flex-1 overflow-y-auto">
				<div className="pt-2" />
				{children}
			</nav>
			<MiniMenu />
		</aside>
	);
}
