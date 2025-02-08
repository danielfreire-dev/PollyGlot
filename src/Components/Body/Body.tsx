import React, { useState, useRef, useEffect } from "react";
import RightArrow from "/assets/send.svg";
import MessageBubble from "../MessageBubble.tsx";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "../../env.tsx";
import { nanoid } from "nanoid";

/* Converter `convoJson` para `conversation` */

export default function Body() {
	const [conversation, setConversation] = useState<Message[]>([]);
	const [language, setLanguage] = useState<string>("portuguese");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		scrollToBottom();
	}, [conversation]);

	type Message = { role: "user" | "system" | "error"; content: string | null };

	const apiKey = OPENAI_API_KEY;

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

	async function fetchReport(userMess: Message) {
		try {
			const openai = new OpenAI({
				apiKey: apiKey,
				dangerouslyAllowBrowser: true,
			});

			const response = await openai.chat.completions.create({
				model: "gpt-3.5-turbo",
				messages: [
					{ role: "system", content: systemMessage },
					{
						role: "user",
						content: userMess.content || "",
					},
				],
			});

			setConversation((prevConvo): Message[] => [
				...prevConvo,
				{
					role: "system",
					content: response.choices[0].message.content,
				},
			]);

			setLoading((prev) => !prev);
			setError(""); // Reset the error state
		} catch (err) {
			console.log("Error:", err);
			setError("Unable to access AI. Please refresh and try again");
			setConversation((prevConvo) => [
				...prevConvo,
				{
					role: "error",
					content: "Unable to access AI. Please refresh and try again",
				},
			]);
		}
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const target = e.target as HTMLFormElement;
		const inputElement = target.elements[0] as HTMLInputElement;
		const userMessage = inputElement.value;
		setConversation((prevConvo) => [
			...prevConvo,
			{ role: "user", content: userMessage },
		]);
		inputElement.value = "";

		fetchReport({ role: "user", content: userMessage });
		setLoading((prev) => !prev);
	}

	function scrollToBottom() {
		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
			inline: "center",
		});
	}

	return (
		<main className="flex-1">
			<div className="chat-box">
				<div className="conversation-box">
					{conversation.length > 0 && <MapConversation />}
					<div className="ref" ref={messagesEndRef}></div>
				</div>

				<form className="input-box" onSubmit={handleSubmit}>
					<div className="input-container">
						<input
							id="user-input"
							type="text"
							placeholder="What do you need translated?"
						/>
						<button>
							<img src={RightArrow} alt="right-arrow" />
						</button>
					</div>
					<select
						name="selectLanguage"
						id="select-language"
						className="mt-2"
						value={language}
						onChange={(e) => setLanguage(e.target.value)}
					>
						<option value="portuguese">🇵🇹 portuguese</option>
						<option value="english">🇺🇸 english</option>
						<option value="french">🇫🇷 french</option>
						<option value="japanese">🇵🇱 polish</option>
						<option value="italian">🇮🇹 italian</option>
					</select>
				</form>
			</div>
		</main>
	);
}
