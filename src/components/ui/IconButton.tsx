// src/components/ui/IconButton.tsx
import React from "react";

interface IconButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

export default function IconButton({
	children,
	className = "",
	...props
}: IconButtonProps) {
	return (
		<button
			{...props}
			className={`flex h-8 w-8 items-center justify-center rounded-md border border-token bg-surface-alt text-foreground hover:bg-surface transition ${className}`}
		>
			{children}
		</button>
	);
}
