import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Hint } from "../../../../components/hint";

export function ModeToggle() {
	const { setTheme } = useTheme();
	const [currentTheme, setCurrentTheme] = useState("light");

	const handleToggleTheme = () => {
		const options = ["light", "dark"];
		const currentOptionIndex = options.indexOf(currentTheme);
		const alternateTheme = options[(currentOptionIndex + 1) % options.length];
		setTheme(alternateTheme);
		setCurrentTheme(alternateTheme);
	};

	return (
		<Hint text="Toggle theme" side="right">
			<Button
				variant="ghost"
				size="sm"
				className="size-6"
				onClick={handleToggleTheme}
			>
				<Sun className="dark:-rotate-90 size-3 rotate-0 scale-100 transition-all dark:scale-0" />
				<Moon className="absolute size-3 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				<span className="sr-only">Toggle theme</span>
			</Button>
		</Hint>
	);
}
