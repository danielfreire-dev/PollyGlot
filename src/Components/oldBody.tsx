import React, { useState, useRef } from "react";
import RightArrow from "/assets/chevron-right.svg";
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

	let convoJson: Message[] = [
		{
			role: "user",
			content: "hey",
		},
		{
			role: "system",
			content: "oi",
		},
		{
			role: "user",
			content: "hi",
		},
		{
			role: "system",
			content: "oi",
		},
		{
			role: "user",
			content: "boas",
		},
		{
			role: "system",
			content: "Olá!",
		},
		{
			role: "user",
			content: "hey there",
		},
		{
			role: "system",
			content: "olá",
		},
		{
			role: "user",
			content: "yes",
		},
		{
			role: "system",
			content: "Sim",
		},
		{
			role: "user",
			content: "no",
		},
		{
			role: "system",
			content: "Não",
		},
		{
			role: "user",
			content: "maybe",
		},
		{
			role: "system",
			content: "talvez",
		},
		{
			role: "user",
			content: "may",
		},
		{
			role: "system",
			content: "pode",
		},
		{
			role: "user",
			content: "hey",
		},
		{
			role: "system",
			content: "oi",
		},
		{
			role: "user",
			content: "hi",
		},
		{
			role: "system",
			content: "oi",
		},
		{
			role: "user",
			content: "boas",
		},
		{
			role: "system",
			content: "Olá!",
		},
		{
			role: "user",
			content: "hey there",
		},
		{
			role: "system",
			content: "olá",
		},
		{
			role: "user",
			content: "yes",
		},
		{
			role: "system",
			content: "Sim",
		},
		{
			role: "user",
			content: "no",
		},
		{
			role: "system",
			content: "Não",
		},
		{
			role: "user",
			content: "maybe",
		},
		{
			role: "system",
			content: "talvez",
		},
		{
			role: "user",
			content: "may",
		},
		{
			role: "system",
			content: "pode",
		},
	];
	type Message = { role: "user" | "system"; content: string | null };

	const apiKey = OPENAI_API_KEY;

	const ScrollIntoViewBox = () => {
		const targetElementRef = useRef(null);

		const handleChange = (event) => {
			// Scroll the target element into view when the change event occurs
			if (targetElementRef.current) {
				targetElementRef.current.scrollIntoView({
					behavior: "smooth",
					block: "end",
				});
			}
		};
		const convo = convoJson.map((conv) => {
			return (
				<MessageBubble
					key={nanoid()}
					message={conv.content}
					role={conv.role}
					ref={targetElementRef}
				/>
			);
		});
		return convo;
	};
	console.log(conversation);
	console.log(language);

	function MapConversation() {}

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

	function scrollToBottom() {
		// Scroll the target element into view when the change event occurs
		if (targetElementRef.current) {
			targetElementRef.current.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	}

	return (
		<main className="flex-1">
			<div className="chat-box">
				<div className="conversation-box" onChange={scrollToBottom}>
					{convoJson.length > 0 && <ScrollIntoViewBox />}
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
						<option value="portuguese">portuguese</option>
						<option value="english">english</option>
						<option value="french">french</option>
						<option value="japanese">japanese</option>
						<option value="italian">italian</option>
						<option value="russian">russian</option>
						<option value="polish">polish</option>
					</select>
				</form>
			</div>
		</main>
	);
}
