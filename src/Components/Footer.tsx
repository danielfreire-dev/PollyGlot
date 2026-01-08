export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="footer">
			<small>
				{year} © Made with 🌍 by <span> </span>
				<a href="https://daniel-freire.com" target="_blank">
					Daniel Freire
				</a>
			</small>
		</footer>
	);
}
