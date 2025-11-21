export default function Tabs({ active, setActive }) {
	const tabs = ["Popular", "Top Rated", "Trending", "Now Playing"];

	return (
		<div className="flex justify-center gap-4 my-6">
			{tabs.map((t) => (
				<button
					key={t}
					onClick={() => setActive(t)}
					className={`px-4 py-2 rounded ${
						active === t ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300"
					}`}
				>
					{t}
				</button>
			))}
		</div>
	);
}
