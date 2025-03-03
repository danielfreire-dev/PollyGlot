import pollyglot from "/assets/parrot.png";

export default function Header() {
	return (
		<header className="header header-background">
			<img src={pollyglot} className="header--image" alt="PollyGlot logo" />
			<div>
				<h1 className="header-title">
					polly
					<span className="text-uppercase">g</span>lot
				</h1>
				<p>Perfect Translation Every Time</p>
			</div>
		</header>
	);
}
