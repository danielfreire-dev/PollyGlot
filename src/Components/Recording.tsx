import { useState, useEffect, useRef } from "react";

import RecordingBall from "/assets/recording.svg";
import Pause from "/assets/pause.svg";
import Text from "/assets/text.svg";
import Mic from "/assets/mic.svg";
import Play from "/assets/play.svg";

interface RecordingProps {
	recordingMenu: boolean;
	setRecordingMenu: (value: boolean | ((prevVar: boolean) => boolean)) => void;
	language: string;
	isActive: boolean;
	setIsActive: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

export default function Recording({
	recordingMenu,
	setRecordingMenu,
	language,
	isActive,
	setIsActive,
}: RecordingProps) {
	const [text, setText] = useState<string>("");
	const recognitionRef = useRef<any>(null);

	useEffect(() => {
		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;
		if (SpeechRecognition && !recognitionRef.current) {
			const recognition = new SpeechRecognition();
			recognition.lang = language;
			recognition.continuous = false;
			recognition.maxAlternatives = 1;

			recognition.onresult = async function (event) {
				const transcript = event.results[0][0].transcript;
				console.log(transcript);
				setText(transcript);
			};

			console.log("text: " + text);

			recognitionRef.current = recognition;
		}
	}, [language]);

	/* Start recording and turn it into text */
	function handleOnRecord() {
		const recognition = recognitionRef.current;

		if (isActive) {
			recognition.stop();
		} else {
			recognition.start();
		}

		setIsActive((prev: boolean) => !prev);
		/* setRecordingMenu((prev: boolean) => !prev); */
		console.log("recognition: " + recognition);
	}

	return (
		<>
			{recordingMenu ? (
				<>
					{isActive ? (
						<>
							<img
								className="microphone-icon clickabe-icon"
								src={RecordingBall}
								alt="audio recording"
							/>
							<img
								className="microphone-icon clickabe-icon"
								src={Pause}
								onClick={handleOnRecord}
								alt="pause"
							/>
						</>
					) : (
						<img
							className="microphone-icon clickabe-icon"
							src={Play}
							onClick={handleOnRecord}
							alt="pause"
						/>
					)}
					<img
						className="microphone-icon clickabe-icon"
						src={Text}
						onClick={() => setRecordingMenu(false)}
						alt="text input"
					/>
				</>
			) : (
				<img
					className="microphone-icon clickabe-icon"
					src={Mic}
					onClick={() => setRecordingMenu(true)}
					alt="audio input"
				/>
			)}
		</>
	);
}
