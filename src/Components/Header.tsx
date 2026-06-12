import pollyglot from "/assets/parrot.png";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
	return (
		<header className="header header-background">
			<img
				src={pollyglot}
				className="header--image"
				alt="PollyGlot logo"
			/>
			<div>
				<h1 className="header-title">
					polly
					<span className="text-uppercase">g</span>lot
				</h1>
				<p>Perfect Translation Every Time</p>
			</div>
			<div style={{ marginLeft: "auto" }}>
				<ThemeToggle />
			</div>
		</header>
	);
}
