import { greyCheck } from "/assets/check-circle_grey.svg";
import { greenCheck } from "/assets/check-circle_green.svg";

interface CookiePreferencesProps {
	HandleCookiePreferences: (preferences: CombinedPreferences) => void;
}

export default function CookiePreferences(
	{ HandleCookiePreferences }: CookiePreferencesProps,
	analytics: boolean,
	social: boolean,
	advertising: boolean,
) {
	return (
		<div className="cookies-preferences">
			<h2>Cookie Preferences</h2>
			<p>
				Manage your cookie preferences below. Essential cookies are always
				enabled as they are necessary for the website to function properly.
			</p>

			<div className="preferences-table">
				<div className="preferences-row">
					<h4>Essential</h4>
					<p>Required for the website to function properly.</p>
					<small>Status: Always enabled</small>
				</div>
				<div>Always on</div>
				<div className="preferences-row">
					<div>
						<h4>Analytics</h4>
						<p>Help us understand how visitors interact with our website.</p>
					</div>
					<button>
						{analytics ? (
							<img src={greenCheck} alt="checked icon" />
						) : (
							<img src={greyCheck} alt="not checked icon" />
						)}
					</button>
				</div>
				<div className="preferences-row">
					<div>
						<h4>Social</h4>
						<p>Enable social media features and sharing.</p>
					</div>
					<button>
						{social ? (
							<img src={greenCheck} alt="checked icon" />
						) : (
							<img src={greyCheck} alt="not checked icon" />
						)}
					</button>
				</div>
				<div className="preferences-row">
					<div>
						<h4>Advertising</h4>
						<p>Personalize advertisements and measure their performance.</p>
					</div>
					<button>
						{advertising ? (
							<img src={greenCheck} alt="checked icon" />
						) : (
							<img src={greyCheck} alt="not checked icon" />
						)}
					</button>
				</div>
			</div>
			<div className="preferences-btns">
				<button type="button">Cancel</button>
				<button type="button"> Save Preferences</button>
			</div>
		</div>
	);
}
