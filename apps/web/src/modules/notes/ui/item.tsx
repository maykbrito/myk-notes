import type { Id } from "@my-better-t-app/backend/convex/_generated/dataModel";
import {
	ChevronDown,
	ChevronRight,
	type LucideIcon,
	Minus,
	Plus,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
	id?: Id<"notes">;
	active?: boolean;
	expanded?: boolean;
	level?: number;
	onExpand?: () => void;
	onCreate?: () => void;
	onArchive?: () => void;

	onClick: () => void;
	icon: LucideIcon;
	label: string;
}
export function Item({
	id,
	label,
	onClick,
	icon: Icon,
	active,
	onExpand,
	onCreate,
	onArchive,
	expanded,
	level = 0,
}: Props) {
	const ChevronIcon = expanded ? ChevronDown : ChevronRight;

	const handleExpand = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent,
	) => {
		event.stopPropagation();
		onExpand?.();
	};

	const handleCreate = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent,
	) => {
		event.stopPropagation();
		onCreate?.();
	};

	const handleArchive = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent,
	) => {
		event.stopPropagation();
		onArchive?.();
	};

	return (
		<button
			type="button"
			onClick={onClick}
			style={{ paddingLeft: level ? `${level * 20 + 12}px` : "12px" }}
			className={cn(
				"group flex min-h-[27px] w-full cursor-pointer items-center p-2 font-medium text-muted-foreground text-sm hover:bg-primary/5",
				active && "bg-primary/5 text-foreground",
			)}
		>
			{Boolean(id) && (
				// biome-ignore lint/a11y/useSemanticElements: I want it that way
				<div
					role="button"
					tabIndex={0}
					onClick={handleExpand}
					className="mx-1 h-full rounded-sm"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleExpand(e);
						}
					}}
				>
					<ChevronIcon className="size-4 shrink-0 text-muted-foreground/50" />
				</div>
			)}

			<Icon className="mr-2 h-[18px] shrink-0 text-muted-foreground" />
			<span className="truncate">{label}</span>

			{Boolean(id) && (
				<div className="ml-auto flex items-center gap-x-2">
					{/** biome-ignore lint/a11y/useSemanticElements: I want it that way */}
					<div
						role="button"
						tabIndex={0}
						onClick={handleArchive}
						className="ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300/40 group-hover:opacity-100 dark:hover:bg-neutral-700/40"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleArchive(e);
							}
						}}
					>
						<Minus className="size-4 shrink-0 text-muted-foreground/50" />
					</div>
					{/** biome-ignore lint/a11y/useSemanticElements: I want it that way */}
					<div
						role="button"
						tabIndex={0}
						onClick={handleCreate}
						className="ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300/40 group-hover:opacity-100 dark:hover:bg-neutral-700/40"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleCreate(e);
							}
						}}
					>
						<Plus className="size-4 shrink-0 text-muted-foreground/50" />
					</div>
				</div>
			)}
		</button>
	);
}

Item.Skeleton = function ItemSkeleton({ level = 0 }: { level?: number }) {
	return (
		<div
			className="ml-1 flex w-full items-center gap-2"
			style={{ paddingLeft: level ? `${level * 20 + 12}px` : "12px" }}
		>
			<Skeleton className="size-4 bg-muted-foreground/20" />
			<Skeleton className="size-4  w-[80%] bg-muted-foreground/20" />
		</div>
	);
};
