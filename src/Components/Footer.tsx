import React from "react";

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="footer">
			<small>
				© {year}{" "}
				<a href="https://danielfreire.pages.dev" target="_blank">
					Daniel Freire
				</a>
				. All rights reserved.
			</small>
		</footer>
	);
}
