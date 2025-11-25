// src/components/ui/SectionHeader.tsx
interface SectionHeaderProps {
	title: string;
	eyebrow?: string;
	className?: string;
}

export default function SectionHeader({
	title,
	eyebrow,
	className = "",
}: SectionHeaderProps) {
	return (
		<header className={`mb-4 ${className}`}>
			{eyebrow && (
				<p className="text-xs uppercase tracking-wide text-muted mb-1">
					{eyebrow}
				</p>
			)}
			<h2 className="text-xl font-semibold text-foreground tracking-tight">
				{title}
			</h2>
		</header>
	);
}
