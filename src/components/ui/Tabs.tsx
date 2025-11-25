// src/components/Tabs.tsx
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface TabItem {
	id: string;
	label: string;
	icon?: ReactNode;
	tooltip?: string;
}

interface TabsProps {
	tabs: TabItem[];
	value: string;
	onChange: (id: string) => void;
	className?: string;
}

export default function Tabs({
	tabs,
	value,
	onChange,
	className = "",
}: TabsProps) {
	return (
		<div
			className={`
        inline-flex items-center gap-2 rounded-full
        bg-surface/60 backdrop-blur-md border border-white/10
        px-2 py-1
        ${className}
      `}
		>
			{tabs.map((t) => {
				const active = t.id === value;
				return (
					<button
						key={t.id}
						onClick={() => onChange(t.id)}
						className={`
						relative px-3 py-1.5 text-sm rounded-full flex items-center gap-1.5
						transition-all
						${active ? "text-foreground" : "text-muted hover:text-foreground"}
						`}
						title={t.tooltip}
					>
						{active && (
							<motion.div
								layoutId="tab-pill"
								className="absolute inset-0 rounded-full bg-accent"
								transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
							/>
						)}

						<span className="relative z-10 flex items-center gap-1">
							{t.icon}
							{t.label}
						</span>
					</button>
				);
			})}
		</div>
	);
}
