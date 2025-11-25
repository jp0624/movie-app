// src/components/ui/Badge.tsx
import React from "react";

interface BadgeProps {
	children: React.ReactNode;
	className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
	return (
		<span
			className={`inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-foreground ${className}`}
		>
			{children}
		</span>
	);
}
