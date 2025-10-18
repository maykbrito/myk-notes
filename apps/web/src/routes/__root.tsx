import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Loader from "@/components/loader";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "../index.css";
import { Authenticated, Unauthenticated } from "convex/react";
import { Login } from "@/components/login";

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

	return (
		<>
			<HeadContent />
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				disableTransitionOnChange
				storageKey="vite-ui-theme"
			>
				<main className="flex h-dvh w-dvw overflow-hidden">
					<Authenticated>{isFetching ? <Loader /> : <Outlet />}</Authenticated>
					<Unauthenticated>
						<Login />
					</Unauthenticated>
				</main>

				<Toaster richColors />
			</ThemeProvider>
			<TanStackRouterDevtools position="bottom-left" />
		</>
	);
}
