// src/components/system/PageLoader.tsx
export default function PageLoader() {
	return (
		<div className="flex h-[60vh] items-center justify-center">
			<div className="animate-pulse text-muted text-lg">Loading…</div>
		</div>
	);
}
