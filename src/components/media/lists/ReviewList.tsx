// src/components/media/lists/ReviewList.tsx
interface Props {
	reviews: any[];
	className?: string;
}

export default function ReviewList({ reviews, className = "" }: Props) {
	if (!Array.isArray(reviews)) return null;

	return (
		<div className={"space-y-6 " + className}>
			{reviews.map((r) => (
				<div
					key={r.id}
					className="rounded-xl border border-token bg-surface p-4"
				>
					<p className="text-sm font-semibold text-foreground">{r.author}</p>
					<p className="mt-2 whitespace-pre-line text-sm text-muted">
						{r.content}
					</p>
				</div>
			))}
		</div>
	);
}
