import { useState, useEffect, useRef } from "react";

import RecordingBall from "/assets/recording.svg";
import Pause from "/assets/pause.svg";
import Text from "/assets/text.svg";
import Mic from "/assets/mic.svg";
import Play from "/assets/play.svg";

type Message = { role: "user" | "system" | "error"; content: string | null };
interface RecordingProps {
	recordingMenu: boolean;
	setRecordingMenu: (value: boolean | ((prevVar: boolean) => boolean)) => void;
	language: string;
	isActive: boolean;
	setIsActive: (value: boolean | ((prevVar: boolean) => boolean)) => void;
	setConversation: (
		value: Message[] | ((prevVar: Message[]) => Message[]),
	) => void;
}

export default function Recording({
	recordingMenu,
	setRecordingMenu,
	language,
	isActive,
	setIsActive,
	setConversation,
}: RecordingProps) {
	const [text, setText] = useState<string>("");
	const recognitionRef = useRef<any>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

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
				setConversation((prevConvo): Message[] => [
					...prevConvo,
					{
						role: "user",
						content: transcript,
					},
				]);
				console.log("transcript: " + transcript);
			};

			recognitionRef.current = recognition;
		}
	}, [language]);

	useEffect(() => {
		return () => {
			if (mediaRecorderRef.current) {
				mediaRecorderRef.current.stream
					?.getTracks()
					.forEach((track) => track.stop());
			}
		};
	}, []);

	/* Start recording and turn it into text */
	async function handleOnRecord() {
		const recognition = recognitionRef.current;

		if (isActive) {
			// Stop both recognition and media recording
			recognition.stop();
			if (mediaRecorderRef.current) {
				mediaRecorderRef.current.stop();
			}
		} else {
			try {
				// Get audio stream and setup media recorder
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				const mediaRecorder = new MediaRecorder(stream);
				mediaRecorderRef.current = mediaRecorder;

				// Setup data handler
				mediaRecorder.ondataavailable = (e) => {
					setAudioChunks((prev) => [...prev, e.data]);
				};

				// Handle recording stop
				mediaRecorder.onstop = () => {
					const blob = new Blob(audioChunks, { type: "audio/wav" });
					setAudioBlob(blob);
					setAudioChunks([]);
					stream.getTracks().forEach((track) => track.stop());
				};

				mediaRecorder.start();
				recognition.start();
			} catch (err) {
				console.error("Error accessing microphone:", err);
			}
		}
		setIsActive((prev) => !prev);
	}

	return (
		<>
			{recordingMenu ? (
				<>
					<img
						className="microphone-icon clickabe-icon"
						src={Text}
						onClick={() => setRecordingMenu(false)}
						alt="text input"
					/>
					{isActive ? (
						<>
							<img
								className="microphone-icon clickabe-icon"
								src={Pause}
								onClick={handleOnRecord}
								alt="pause"
							/>
							<img
								className="microphone-icon clickabe-icon"
								src={RecordingBall}
								alt="audio recording"
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
