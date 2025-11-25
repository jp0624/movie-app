// src/hooks/useAISuggestions.ts
import { useEffect, useState } from "react";

export interface AISuggestion {
	id: string;
	label: string;
	query: string;
}

export function useAISuggestions(query: string) {
	const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

	useEffect(() => {
		const trimmed = query.trim();
		if (!trimmed) {
			setSuggestions([
				{
					id: "sci-fi",
					label: "Top rated sci-fi movies",
					query: "science fiction",
				},
				{
					id: "comedy",
					label: "Popular comedy TV shows",
					query: "comedy",
				},
				{
					id: "family",
					label: "Family friendly movies",
					query: "family",
				},
				{
					id: "oscar",
					label: "Oscar-winning movies",
					query: "oscar winners",
				},
			]);
			return;
		}

		const lower = trimmed.toLowerCase();

		const base: AISuggestion[] = [
			{
				id: "best-movies",
				label: `Best ${trimmed} movies`,
				query: `${lower} movies`,
			},
			{
				id: "top-tv",
				label: `Top ${trimmed} TV shows`,
				query: `${lower} tv`,
			},
			{
				id: "similar",
				label: `Stuff like "${trimmed}"`,
				query: `${lower}`,
			},
			{
				id: "by-year",
				label: `${trimmed} from the last 5 years`,
				query: `${lower} 2020 2021 2022 2023 2024`,
			},
		];

		setSuggestions(base);
	}, [query]);

	return suggestions;
}
