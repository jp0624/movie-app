// src/components/media/MovieSkeleton.tsx
export default function MovieSkeleton() {
	return (
		<div className="animate-pulse rounded-xl overflow-hidden border border-token bg-surface-alt">
			<div className="h-64 w-full bg-muted/30" />
			<div className="p-3 space-y-2">
				<div className="h-4 bg-muted/30 rounded" />
				<div className="h-3 w-1/2 bg-muted/30 rounded" />
			</div>
		</div>
	);
}
