// src/components/ui/Badge.tsx
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
}

export default function Badge({ children, className = "" }: Props) {
	return (
		<span
			className={`inline-flex items-center rounded-full border border-token bg-surface-alt px-2 py-0.5 text-xs text-muted ${className}`}
		>
			{children}
		</span>
	);
}
