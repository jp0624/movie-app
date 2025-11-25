// src/components/ui/Surface.tsx
import type { ReactNode } from "react";

interface SurfaceProps {
	children: ReactNode;
	className?: string;
	as?: keyof JSX.IntrinsicElements;
}

export default function Surface({
	children,
	className = "",
	as: Tag = "section",
}: SurfaceProps) {
	return (
		<Tag
			className={`bg-surface-alt border border-token rounded-2xl p-4 sm:p-5 shadow-card ${className}`}
		>
			{children}
		</Tag>
	);
}
