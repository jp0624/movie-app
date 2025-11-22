// src/types/Person.ts
import type { CombinedCredits, CreditEntry } from "./Shared";

/**
 * Detailed TMDB person object.
 */
export interface Person {
	id: number;
	name: string;
	biography: string;
	birthday?: string | null;
	deathday?: string | null;
	place_of_birth?: string | null;
	known_for_department?: string;
	gender?: number;
	homepage?: string | null;
	profile_path: string | null;
	also_known_as?: string[];
	popularity?: number;
}

/**
 * Re-export credit-related types so callers can
 * import everything from "types/Person" if they want.
 */
export type { CreditEntry, CombinedCredits };
