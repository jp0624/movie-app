// src/components/media/ReviewsList.tsx
import { motion } from "framer-motion";
import type { Review } from "../../types/Shared";

interface Props {
	reviews: Review[];
}

export default function ReviewsList({ reviews }: Props) {
	if (!reviews || reviews.length === 0) {
		return <p className="text-sm text-muted py-4">No reviews available.</p>;
	}

	return (
		<div className="flex flex-col gap-6">
			{reviews.map((rev, idx) => {
				const avatar =
					rev.author_details?.avatar_path &&
					rev.author_details.avatar_path.startsWith("/http")
						? rev.author_details.avatar_path.slice(1) // external img
						: rev.author_details?.avatar_path
						? `https://image.tmdb.org/t/p/w185${rev.author_details.avatar_path}`
						: "/no-avatar.png";

				const rating = rev.author_details?.rating;

				return (
					<motion.div
						key={rev.id}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: idx * 0.05 }}
						className="rounded-xl border border-token bg-surface-alt p-4 shadow-card"
					>
						<div className="flex items-start gap-4">
							{/* Avatar */}
							<img
								src={avatar}
								alt={rev.author}
								className="h-12 w-12 rounded-full border border-token object-cover"
							/>

							<div className="flex flex-col gap-2 flex-1">
								{/* Author */}
								<div className="flex items-center justify-between">
									<h4 className="text-sm font-semibold text-foreground">
										{rev.author}
									</h4>

									{rating != null && (
										<div className="text-xs text-yellow-400 font-semibold">
											★ {rating}/10
										</div>
									)}
								</div>

								{/* Date */}
								<p className="text-xs text-muted">
									{new Date(rev.created_at).toLocaleDateString()}
								</p>

								{/* Content */}
								<p className="text-sm text-foreground leading-relaxed">
									{rev.content}
								</p>

								{/* Link to full review */}
								{rev.url && (
									<a
										href={rev.url}
										target="_blank"
										rel="noreferrer"
										className="text-xs text-accent hover:underline mt-1"
									>
										Read full review →
									</a>
								)}
							</div>
						</div>
					</motion.div>
				);
			})}
		</div>
	);
}
