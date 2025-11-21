interface TabsProps {
	active: string;
	setActive: (tab: string) => void;
}

export default function Tabs({ active, setActive }: TabsProps) {
	const tabs = ["Popular", "Top Rated", "Trending", "Now Playing"];

	return (
		<div className="flex gap-4 justify-center mb-6">
			{tabs.map((t) => (
				<button
					key={t}
					onClick={() => setActive(t)}
					className={`px-4 py-2 rounded ${
						active === t
							? "bg-red-600 text-white"
							: "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
					}`}
				>
					{t}
				</button>
			))}
		</div>
	);
}
