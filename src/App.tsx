import "./App.css";
import "/src/css/styles.css";

import ReactGA from "react-ga4";
import Header from "./Components/Header";
import Body from "./Components/Body/Body";
import Footer from "./Components/Footer";

function App() {
	const GoogleAnalytics: string =
		import.meta.env.REACT_APP_googleAnalytics || "";

	/* Multiple products (previously known as trackers) */
	ReactGA.initialize([
		{
			trackingId: GoogleAnalytics,
		},
	]);

	ReactGA.send({
		hitType: "pageview",
		page: "/my-path",
		title: "PollyGlot",
	});

	return (
		<>
			<Header />
			<Body />
			<Footer />
		</>
	);
}

export default App;
