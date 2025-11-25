// src/components/media/WatchProviders.tsx
import type { WatchProvidersResponse } from "../../../types/Shared";

interface WatchProvidersProps {
	providers: WatchProvidersResponse | null;
}

export default function WatchProviders({ providers }: WatchProvidersProps) {
	if (!providers || !providers.results) {
		return <p className="text-sm text-muted">No provider data available.</p>;
	}

	const results = providers.results;

	const preferredCountry =
		results["CA"] ?? results["US"] ?? (results && Object.values(results)[0]);

	if (!preferredCountry) {
		return <p className="text-sm text-muted">No provider data available.</p>;
	}

	const { flatrate, rent, buy } = preferredCountry;

	return (
		<div className="space-y-3 text-sm text-muted">
			{/* Streaming */}
			{flatrate && flatrate.length > 0 && (
				<div>
					<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
						Streaming
					</p>
					<div className="flex flex-wrap gap-2">
						{flatrate.map((p) => (
							<div
								key={p.provider_id}
								className="flex items-center gap-2 rounded-full bg-surface-alt px-2 py-1 text-xs"
							>
								{p.logo_path && (
									<img
										src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
										alt={p.provider_name}
										loading="lazy"
										className="h-5 w-5 rounded"
									/>
								)}
								<span>{p.provider_name}</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Rent */}
			{rent && rent.length > 0 && (
				<div>
					<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
						Rent
					</p>
					<div className="flex flex-wrap gap-2">
						{rent.map((p) => (
							<span
								key={p.provider_id}
								className="rounded-full bg-surface-alt px-2 py-1 text-xs"
							>
								{p.provider_name}
							</span>
						))}
					</div>
				</div>
			)}

			{/* Buy */}
			{buy && buy.length > 0 && (
				<div>
					<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
						Buy
					</p>
					<div className="flex flex-wrap gap-2">
						{buy.map((p) => (
							<span
								key={p.provider_id}
								className="rounded-full bg-surface-alt px-2 py-1 text-xs"
							>
								{p.provider_name}
							</span>
						))}
					</div>
				</div>
			)}

			{!flatrate && !rent && !buy && (
				<p className="text-sm text-muted">No provider data available.</p>
			)}
		</div>
	);
}
