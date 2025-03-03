import { useState, useEffect } from "react";
import CookieFrontPage from "./CookieFrontPage";
import CookiePreferences from "./CookiePreferences";
import useAnalyticsEventTracker from "../../assets/analytics";

export default function CookieBanner() {
	const [analytics, setAnalytics] = useState<boolean>(false);
	const [social, setSocial] = useState<boolean>(false);
	const [advertising, setAdvertising] = useState<boolean>(false);
	const [preferences, setPreferences] = useState<Preferences>({
		Analytics: analytics,
		Social: social,
		Advertising: advertising,
	});
	const [manageBool, setManageBool] = useState<boolean>(false);
	useEffect(() => {
		if (analytics) {
			useAnalyticsEventTracker;
		}
	}, [analytics]);

	type Preferences = {
		Analytics: boolean | undefined;
		Social: boolean | undefined;
		Advertising: boolean | undefined;
	};

	function handleAcceptAll() {
		setAnalytics(true);
		setSocial(true);
		setAdvertising(true);
	}
	function HandleCookiePreferences(preferences: CombinedPreferencs) {
		if (preferences.Analytics) {
			setAnalytics(true);
		}
		if (preferences.Social) {
			console.log("Social Cookies Activated");
		}
		if (preferences.Advertising) {
			console.log("Advertising Cookies Activated");
		}
	}

	return (
		<div className="cookie-container">
			{manageBool ? (
				<CookieFrontPage handleAcceptAll={handleAcceptAll()} />
			) : (
				<CookiePreferences HandleCookiePreferences={HandleCookiePreferences} />
			)}
		</div>
	);
}
