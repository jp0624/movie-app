// src/components/ui/ModeToggleTabs.tsx
import React from "react";

interface ModeToggleTabsProps {
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
}

export default function ModeToggleTabs({
	value,
	onChange,
	options,
}: ModeToggleTabsProps) {
	return (
		<div
			role="tablist"
			className="inline-flex rounded-lg border border-token bg-surface-alt overflow-hidden"
		>
			{options.map((opt) => {
				const selected = opt.value === value;
				return (
					<button
						key={opt.value}
						role="tab"
						aria-selected={selected}
						className={`px-3 py-1 text-sm ${
							selected
								? "bg-foreground text-background"
								: "text-muted hover:text-foreground"
						}`}
						onClick={() => onChange(opt.value)}
					>
						{opt.label}
					</button>
				);
			})}
		</div>
	);
}
