export default function CookieFrontPage({ handleAcceptAll }) {
	return (
		<div className="cookie-banner">
			<h2 className="cookie-title">Would You Like A Cookie? 🍪</h2>
			<p className="cookie-description">
				We value your privacy. Choose which cookies, if any, you want to allow.
				Essential cookies are always enabled as they are necessary for the
				website to function properly.
			</p>
			<div className="cookie-btns">
				<button>Privacy Policy</button>
				<button>Manage Cookies</button>
				<button type="button">Decline</button>
				<button onClick={handleAcceptAll}>Accept All</button>
			</div>
		</div>
	);
}
