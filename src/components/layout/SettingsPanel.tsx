// src/components/layout/SettingsPanel.tsx
import Surface from "../ui/Surface";
import ThemeSwitcher from "./ThemeSwitcher";

export default function SettingsPanel() {
	return (
		<Surface className="p-4 space-y-6">
			<div>
				<h2 className="text-lg font-semibold text-foreground">Settings</h2>
				<p className="text-sm text-muted">Customize your experience</p>
			</div>

			<div className="grid gap-4">
				<div className="flex items-center justify-between">
					<span className="text-sm text-foreground">Theme</span>
					<ThemeSwitcher />
				</div>
			</div>
		</Surface>
	);
}
