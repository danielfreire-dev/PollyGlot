import React, { useState, useRef, useEffect } from "react";
import RightArrow from "/assets/chevron-right.svg";
import MessageBubble from "../MessageBubble.tsx";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "../../env.tsx";
import { nanoid } from "nanoid";

type Message = { role: "user" | "system"; content: string | null };

export default function Body() {
	const [conversation, setConversation] = useState<Message[]>([]);
	const [language, setLanguage] = useState<string>("portuguese");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const targetElementRef = useRef<HTMLDivElement>(null);

	let convoJson: Message[] = [
		{
			role: "user",
			content: "hey",
		},
		{
			role: "system",
			content: "oi",
		},
		// ... (other messages)
	];

	useEffect(() => {
		// Scroll to the bottom whenever the conversation changes
		if (targetElementRef.current) {
			targetElementRef.current.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});
		}
	}, [conversation]);

	const apiKey = OPENAI_API_KEY;

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
						content: userMess.content,
					},
				],
			});
			console.log(response.choices[0].message.content);
			setConversation((prevConvo): Message[] => [
				...prevConvo,
				{
					role: "system",
					content: response.choices[0].message.content,
				},
			]);
		} catch (err) {
			console.log("Error:", err);
			setError("Unable to access AI. Please refresh and try again");
		}
	}

	function handleSubmit(e) {
		e.preventDefault();
		const userMessage = e.target.elements[0].value;
		setConversation((prevConvo) => [
			...prevConvo,
			{ role: "user", content: userMessage },
		]);
		e.target.elements[0].value = "";
		fetchReport({ role: "user", content: userMessage });
	}

	return (
		<main className="flex-1">
			<div className="chat-box">
				<div className="conversation-box">
					{conversation.map((conv, index) => (
						<MessageBubble
							key={nanoid()}
							message={conv.content}
							role={conv.role}
							ref={index === conversation.length - 1 ? targetElementRef : null}
						/>
					))}
				</div>
				{error && <div>{error}</div>}
				<form className="input-box" onSubmit={handleSubmit}>
					<div>
						<input type="text" placeholder="What do you need translated?" />
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
						<option value="portuguese">Portuguese</option>
						<option value="english">English</option>
						<option value="french">French</option>
						<option value="japanese">Japanese</option>
						<option value="italian">Italian</option>
						<option value="russian">Russian</option>
						<option value="polish">Polish</option>
					</select>
				</form>
			</div>
		</main>
	);
}
