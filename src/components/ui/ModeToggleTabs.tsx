// src/components/ui/ModeToggleTabs.tsx
import type { ReactNode } from "react";

interface Option {
	value: string;
	label: ReactNode;
}

interface Props {
	options: Option[];
	value: string;
	onChange: (value: string) => void;
}

export default function ModeToggleTabs({ options, value, onChange }: Props) {
	return (
		<div className="inline-flex rounded-full bg-surface-alt border border-token px-1 py-1 text-xs shadow-card">
			{options.map((opt) => {
				const active = opt.value === value;
				return (
					<button
						key={opt.value}
						type="button"
						onClick={() => onChange(opt.value)}
						className={`relative z-10 rounded-full px-3 py-1 transition-colors ${
							active
								? "bg-background text-foreground shadow-card"
								: "text-muted hover:text-foreground"
						}`}
					>
						{opt.label}
					</button>
				);
			})}
		</div>
	);
}
