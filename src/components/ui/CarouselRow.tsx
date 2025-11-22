// src/components/ui/CarouselRow.tsx
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function CarouselRow({ children }: Props) {
	return (
		<div className="overflow-x-auto">
			<div className="flex gap-3 pb-2">{children}</div>
		</div>
	);
}
