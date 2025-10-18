import { useAuthActions } from "@convex-dev/auth/react";
import { GitHubLogo } from "./GithubLogo";
import { Button } from "./ui/button";

export function Login() {
	const { signIn } = useAuthActions();
	return (
		<div className="grid place-content-center max-w-md mx-auto">
			<h1 className="text-2xl font-bold mb-4 text-center">
				Login ou registre-se
			</h1>
			<Button
				className="flex-1"
				variant="outline"
				type="button"
				onClick={() => void signIn("github")}
			>
				<GitHubLogo className="mr-2 h-4 w-4" /> GitHub
			</Button>
		</div>
	);
}
