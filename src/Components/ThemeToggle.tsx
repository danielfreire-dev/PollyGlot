import { useTheme, type ThemeMode } from "../context/ThemeContext";

const ICONS: Record<ThemeMode, string> = {
	auto: "🖥️",
	light: "☀️",
	dark: "🌙",
};

const LABELS: Record<ThemeMode, string> = {
	auto: "Auto",
	light: "Light",
	dark: "Dark",
};

const CYCLE: ThemeMode[] = ["auto", "light", "dark"];

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	const handleClick = () => {
		const idx = CYCLE.indexOf(theme);
		const next = CYCLE[(idx + 1) % CYCLE.length];
		setTheme(next);
	};

	return (
		<button
			type="button"
			className="theme-toggle"
			onClick={handleClick}
			aria-label={`Theme: ${LABELS[theme]}. Click to switch.`}
			title={`Current: ${LABELS[theme]}`}>
			<span
				className="theme-toggle-icon"
				aria-hidden="true">
				{ICONS[theme]}
			</span>
			<span className="theme-toggle-label">{LABELS[theme]}</span>
		</button>
	);
}
