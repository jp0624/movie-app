// src/components/ui/Surface.tsx
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
}

export default function Surface({ children, className = "" }: Props) {
	return (
		<div
			className={`rounded-2xl border border-token bg-surface shadow-card p-4 sm:p-6 ${className}`}
		>
			{children}
		</div>
	);
}
