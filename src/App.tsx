import { useState, useEffect } from "react";

import "./App.css";
import "/src/css/styles.css";

import Header from "./Components/Header";
import Body from "./Components/Body/Body";
import Footer from "./Components/Footer";
import useAnalyticsEventTracker from "./assets/analytics";
import Modal from "./Components/Modal";
import CookieBanner from "./Components/CookeModal/CookieBanner";

function App() {
	const [acceptCookies, setAcceptCookies] = useState<boolean>(false);
	const [modalDisplay, setModalDisplay] = useState<boolean>(false);
	/* if cookies accepted, set modalDisplay === false */

	return (
		<>
			<Header />
			<Body />
			<Footer />
		</>
	);
}

export default App;
