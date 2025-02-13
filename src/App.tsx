import { useState, useEffect } from "react";

import "./App.css";
import "/src/css/styles.css";
import { CookieManager } from "react-cookie-manager";
import Header from "./Components/Header";
import Body from "./Components/Body/Body";
import Footer from "./Components/Footer";
import useAnalyticsEventTracker from "./assets/analytics";

function App() {
	const [acceptCookies, setAcceptCookies] = useState<boolean>(false);

	useEffect(() => {
		if (acceptCookies) {
			useAnalyticsEventTracker;
		}
	}, [acceptCookies]);

	type Preferences = {
		Analytics: boolean;
		Social: boolean;
		Advertising: boolean;
	};

	function HandleCookiePreferences(preferences: Preferences) {
		if (preferences.Analytics) {
			setAcceptCookies(true);
		}
		if (preferences.Social) {
			console.log("Social Cookies Activated");
		}
		if (preferences.Advertising) {
			console.log("Advertising Cookies Activated");
		}
	}

	return (
		<>
			<CookieManager
				translations={{
					title: "Would You Like A Cookie? 🍪",
					message:
						"We value your privacy. Choose which cookies, if any,  you want to allow. Essential cookies are always enabled as they are necessary for the website to function properly.",
				}}
				theme="dark"
				cookieName="cookie-manager"
				displayType="modal"
				showManageButton={true}
				onAccept={() => setAcceptCookies(true)}
				onDecline={() => HandleCookiePreferences()}
				onManage={HandleCookiePreferences}
			>
				<Header />
				<Body />
				<Footer />
			</CookieManager>
		</>
	);
}

export default App;
