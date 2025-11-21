export interface Movie {
	id: number;
	title?: string;
	name?: string;
	poster_path: string | null;
	overview: string;
	release_date?: string;
	vote_average: number;
}
