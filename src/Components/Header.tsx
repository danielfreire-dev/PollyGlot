import React from "react";
import pollyglot from "/assets/parrot.png";
import "/src/css/styles.css";
export default function Header() {
	return (
		<header className="header header-background mb-3">
			<img src={pollyglot} className="header--image" alt="PollyGlot logo" />
			<div>
				<h1 className="header--title text-capitalize">
					polly
					<span className="text-uppercase">g</span>lot
				</h1>
			</div>
		</header>
	);
}
