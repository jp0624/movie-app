// src/components/system/ErrorBoundary.tsx
import { Component, ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: any;
}

export default class ErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false, error: null };

	static getDerivedStateFromError(error: any) {
		return { hasError: true, error };
	}

	componentDidCatch(error: any, info: any) {
		console.error("ErrorBoundary caught:", error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback ?? (
					<div className="p-10 text-center text-red-400">
						<h2 className="text-xl font-semibold mb-2">
							Something went wrong.
						</h2>
						<p>{String(this.state.error)}</p>
					</div>
				)
			);
		}
		return this.props.children;
	}
}
