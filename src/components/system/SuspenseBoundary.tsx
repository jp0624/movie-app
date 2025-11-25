// src/components/system/SuspenseBoundary.tsx
import { Suspense, ReactNode } from "react";
import PageLoader from "./PageLoader";

export default function SuspenseBoundary({
	children,
}: {
	children: ReactNode;
}) {
	return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}
