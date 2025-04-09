import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { nanoid } from "nanoid";

import Loading from "./Loading.tsx";
import Recording from "../Recording.tsx";
import MessageBubble from "../MessageBubble.tsx";

import RightArrow from "/assets/send.svg";
import disabledArrow from "/assets/send-grey.svg";

export default function Body() {
	const [conversation, setConversation] = useState<Message[]>([]);
	const [language, setLanguage] = useState<string>("pt-PT");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [recordingMenu, setRecordingMenu] = useState<boolean>(false);
	const [isActive, setIsActive] = useState<boolean>(false);

	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		scrollToBottom();
	}, [conversation]);

	type Message = { role: "user" | "system" | "error"; content: string | null };

	const apiKey: string = import.meta.env.VITE_GEMINI_API_KEY ?? "";

	if (!apiKey) {
		throw new Error("API key is not defined");
	}

	const genAI = new GoogleGenerativeAI(apiKey);

	/* Excluding Firefox because it doesn't work with speech recognition */
	const browser = window.navigator.userAgent;
	const firefox = browser.includes("firefox") || browser.includes("Firefox");
	/* console.log("firefox: " + firefox); */

	function MapConversation() {
		const convo = conversation.map((conv) => {
			return (
				<MessageBubble key={nanoid()} message={conv.content} role={conv.role} />
			);
		});
		return <>{convo}</>;
	}

	const systemMessage =
		"You are a helpful polyglot who will translate the user's message to " +
		language +
		". You will only respond with the translation and nothing else.";

	/* Function to be replaced v */
	async function fetchReport(userMess: Message) {
		try {
			if (typeof userMess.content !== "string") {
				throw new Error("Invalid message content");
			}

			const model = genAI.getGenerativeModel({
				model: "gemini-2.0-flash",
				systemInstruction: systemMessage,
			});

			const result = await model.generateContent(userMess.content);

			setConversation((prevConvo): Message[] => [
				...prevConvo,
				{
					role: "system",
					content: result.response.text(),
				},
			]);

			setError("");
		} catch (err) {
			console.error("Error:", err);
			setError("Unable to access AI. Please refresh and try again");
			setConversation((prevConvo) => [
				...prevConvo,
				{
					role: "error",
					content: "Error: " + error,
				},
			]);
		}
		setLoading(false);
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const target = e.target as HTMLFormElement;
		const inputElement = target.elements[0] as HTMLInputElement;
		const userMessage = inputElement.value;
		setConversation((prevConvo) => [
			...prevConvo,
			{ role: "user", content: userMessage },
		]);
		inputElement.value = "";

		fetchReport({ role: "user", content: userMessage });
	}

	function scrollToBottom() {
		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
			inline: "center",
		});
	}

	function SubmitText() {
		return (
			<div className="input-line ">
				<form className="input-box" onSubmit={handleSubmit}>
					<div className="input-container">
						{!firefox && (
							<Recording
								recordingMenu={recordingMenu}
								setRecordingMenu={setRecordingMenu}
								language={language}
								isActive={isActive}
								setIsActive={setIsActive}
								setConversation={setConversation}
							/>
						)}
						{!recordingMenu && (
							<>
								<input
									id="user-input"
									type="text-box"
									name="userInput"
									required
									placeholder="What do you need translated?"
									autoComplete="off"
								/>
								<button type="submit" disabled={loading}>
									{loading ? (
										<img src={disabledArrow} alt="disabled-right-arrow" />
									) : (
										<img src={RightArrow} alt="right-arrow" />
									)}
								</button>
							</>
						)}
					</div>

					<select
						name="selectLanguage"
						id="select-language"
						className="mt-2"
						value={language}
						onChange={(e) => setLanguage(e.target.value)}
					>
						{/* AI accepts Language Tags (BCP 47) */}
						<option value="pt-Pt">🇵🇹 portuguese</option>
						<option value="en-US">🇺🇸 english</option>
						<option value="fr-FR">🇫🇷 french</option>
						<option value="it-IT">🇮🇹 italian</option>
						<option value="nl-NL">🇳🇱 dutch</option>
						<option value="pl-PL">🇵🇱 polish</option>
					</select>
				</form>
			</div>
		);
	}

	return (
		<main className="flex-1">
			<small className="api-disclaimer">
				This app uses the Google AI API to translate text. Please note that the
				accuracy of the translation may vary depending on the input text and the
				available resources.
			</small>
			<div className="chat-box">
				<div className="conversation-box">
					{conversation.length > 0 && <MapConversation />}
					{loading && <Loading />}
					<div className="ref" ref={messagesEndRef}></div>
				</div>
				<SubmitText />
			</div>
		</main>
	);
}
