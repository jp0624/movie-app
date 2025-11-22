// src/components/ui/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: "primary" | "ghost";
}

export default function Button({
	children,
	variant = "primary",
	className = "",
	...rest
}: Props) {
	const base =
		"inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent";
	const styles =
		variant === "primary"
			? "bg-accent text-white hover:bg-accent-soft"
			: "bg-transparent text-muted hover:text-foreground";

	return (
		<button className={`${base} ${styles} ${className}`} {...rest}>
			{children}
		</button>
	);
}
