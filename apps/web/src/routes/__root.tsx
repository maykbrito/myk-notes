import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Loader from "@/components/loader";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "../index.css";
import { Authenticated, Unauthenticated } from "convex/react";
import { Login } from "@/components/login";
import { Sidebar } from "@/components/sidebar";
import { NotesList } from "@/modules/notes/ui/notes-list";

// biome-ignore lint/complexity/noBannedTypes: para de me encher o saco
export type RouterAppContext = {};

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{
				title: "MIT Notes",
			},
			{
				name: "description",
				content:
					"MIT Notes is a web application to fast and simple save your notes",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.ico",
			},
		],
	}),
});

function RootComponent() {
	const isFetching = useRouterState({
		select: (s) => s.isLoading,
	});

	const navigate = useNavigate();

	return (
		<>
			<HeadContent />
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				disableTransitionOnChange
				storageKey="vite-ui-theme"
			>
				<Unauthenticated>
					<div className="flex h-dvh w-dvw items-center justify-center">
						<Login />
					</div>
				</Unauthenticated>

				<Authenticated>
					<main className="flex h-dvh w-dvw overflow-hidden">
						<Sidebar>
							<NotesList
								onSelectNote={(nid) => {
									if (nid === null) return navigate({ to: "/" });

									navigate({
										to: `/note/${nid}`,
										params: { nid },
									});
								}}
							/>
						</Sidebar>
						<div className="flex-1 flex flex-col overflow-y-auto bg-[color-mix(in_srgb,var(--color-primary)_5%,var(--color-bg)_100%)] relative">
							<div className="flex-1">
								{isFetching ? <Loader /> : <Outlet />}
							</div>
						</div>
					</main>
				</Authenticated>

				<Toaster richColors />
			</ThemeProvider>
			<TanStackRouterDevtools position="bottom-left" />
		</>
	);
}
