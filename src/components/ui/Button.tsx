// src/components/ui/Button.tsx
import React from "react";
import { Link } from "react-router-dom";

interface BaseProps {
	children: React.ReactNode;
	className?: string;
}

type ButtonProps = BaseProps &
	(
		| (React.ButtonHTMLAttributes<HTMLButtonElement> & { to?: never })
		| ({ to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
	);

export default function Button({
	children,
	className = "",
	...props
}: ButtonProps) {
	const base =
		"inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition bg-foreground text-background hover:opacity-90";

	// Link
	if ("to" in props && props.to) {
		return (
			<Link {...props} className={`${base} ${className}`}>
				{children}
			</Link>
		);
	}

	// Button
	return (
		<button {...props} className={`${base} ${className}`}>
			{children}
		</button>
	);
}
