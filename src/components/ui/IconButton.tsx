// src/components/ui/IconButton.tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
}

export default function IconButton({
	children,
	className = "",
	...rest
}: Props) {
	return (
		<button
			className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-token bg-surface-alt text-muted hover:text-foreground hover:bg-surface shadow-card transition-colors ${className}`}
			{...rest}
		>
			{children}
		</button>
	);
}
