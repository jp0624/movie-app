// src/components/ui/SectionHeader.tsx
import type { ReactNode } from "react";

interface Props {
	title: string;
	eyebrow?: string;
	actionSlot?: ReactNode;
}

export default function SectionHeader({ title, eyebrow, actionSlot }: Props) {
	return (
		<div className="mb-4 flex items-start justify-between gap-3">
			<div>
				{eyebrow && (
					<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
						{eyebrow}
					</p>
				)}
				<h2 className="text-lg font-semibold text-foreground sm:text-xl">
					{title}
				</h2>
			</div>
			{actionSlot && (
				<div className="text-xs text-muted flex items-center gap-2">
					{actionSlot}
				</div>
			)}
		</div>
	);
}
