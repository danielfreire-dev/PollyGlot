import React, { useState } from "react";
import RightArrow from "/assets/chevron-right.svg";
import { OPENAI_API_KEY } from "/src/env.tsx";

/* import { arrow } from "@popperjs/core"; */

export default function Body() {
	const [conversation, setConversation] = useState([]);
	const [language, setLanguage] = useState("portuguese");
	const apiKey = OPENAI_API_KEY;
	/* console.log(apiKey); */

	const convo = conversation.map((conv) => conv.language);
	const systemMessage =
		"You are a helpful polyglot who will translate the user's message into " +
		language +
		". You will only respond with the translation and nothing else.";

	return (
		<main>
			<div className="chat-box">
				<div className="conversation-box"></div>
				<form className="input-box">
					<input type="text" placeholder="What do you need translated?" />
					<button>
						<img src={RightArrow} alt="right-arrow" />
					</button>
				</form>
			</div>
			<select name="select-language" id="select-language">
				<option value="portuguese">portuguese</option>
				<option value="english">english</option>
				<option value="french">french</option>
				<option value="japanese">japanese</option>
				<option value="italian">italian</option>
				<option value="russian">russian</option>
				<option value="polish">polish</option>
			</select>
		</main>
	);
}
