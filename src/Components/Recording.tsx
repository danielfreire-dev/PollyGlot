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
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Recording({
	recordingMenu,
	setRecordingMenu,
	language,
	isActive,
	setIsActive,
	handleSubmit,
}: RecordingProps) {
	/* const [text, setText] = useState<string>(""); */
	const recognitionRef = useRef<any>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	/* const [audioChunks, setAudioChunks] = useState<Blob[]>([]); */
	/* const [audioBlob, setAudioBlob] = useState<Blob | null>(null); */
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SpeechRecognition) {
			setError("Speech recognition is not supported in this browser");
			console.error("Speech Recognition API not available");
			return;
		}

		if (!recognitionRef.current) {
			const recognition = new SpeechRecognition();
			recognition.lang = language;
			recognition.continuous = false;
			recognition.maxAlternatives = 1;

			recognition.onresult = async function (event) {
				console.log("Speech recognition result received");
				const transcript = event.results[0][0].transcript;
				const capitalizedTranscript = capitalizeFirstCharacter(transcript);

				console.log(
					"Calling handleSubmit with transcript:",
					capitalizedTranscript,
				);

				// Create a synthetic form event that matches handleSubmit's expected structure
				const syntheticEvent = {
					preventDefault: () => {},
					target: {
						elements: [
							{
								value: capitalizedTranscript,
							},
						],
					},
				} as unknown as React.FormEvent<HTMLFormElement>;

				// Let handleSubmit handle adding the message to conversation
				handleSubmit(syntheticEvent);

				console.log("transcript: " + capitalizedTranscript);
			};

			recognition.onstart = () => {
				console.log("Speech recognition started");
			};

			recognition.onend = () => {
				console.log("Speech recognition ended");
				setIsActive(false); // Ensure state is synced when recognition ends
			};

			recognition.onerror = (event) => {
				setError(`Speech recognition error: ${event.error}`);
				console.error("Speech recognition error:", event.error);
				setIsActive(false);
			};

			recognitionRef.current = recognition;
		}
	}, [language, setIsActive, handleSubmit]); // Removed setConversation from dependencies

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
	async function handleOnRecord(
		e:
			| React.FormEvent<HTMLFormElement>
			| React.MouseEvent<HTMLButtonElement, MouseEvent>
			| React.MouseEvent<HTMLImageElement, MouseEvent>,
	) {
		e.preventDefault();
		const recognition = recognitionRef.current;

		if (!recognition) {
			setError("Speech recognition not initialized");
			return;
		}

		if (isActive) {
			// Stop both recognition and media recording
			console.log("Stopping recording");
			recognition.stop();
			if (mediaRecorderRef.current) {
				mediaRecorderRef.current.stop();
			}
			setIsActive(false);
		} else {
			try {
				console.log("Starting recording");
				// Get audio stream and setup media recorder
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				console.log("Microphone access granted");
				const mediaRecorder = new MediaRecorder(stream);
				mediaRecorderRef.current = mediaRecorder;

				/* mediaRecorder.ondataavailable = (e) => {
					setAudioChunks((prev) => [...prev, e.data]);
				}; */

				mediaRecorder.onstop = () => {
					/* const blob = new Blob(audioChunks, { type: "audio/wav" }); */
					/* setAudioBlob(blob); */
					/* setAudioChunks([]); */
					stream.getTracks().forEach((track) => track.stop());
					console.log("Media recording stopped");
				};

				// Start both together
				mediaRecorder.start();
				recognition.start();
				setIsActive(true);
			} catch (err) {
				console.error("Error accessing microphone:", err);
				setError("Failed to access microphone. Please check permissions.");
				setIsActive(false);
			}
		}
	}

	function capitalizeFirstCharacter(str: string) {
		if (str.length === 0 || str.trim().length === 0) return str;
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	return (
		<>
			{error && (
				<div style={{ color: "red", fontSize: "12px", marginBottom: "10px" }}>
					Error: {error}
				</div>
			)}
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
							<button onClick={handleOnRecord}>
								<img
									className="microphone-icon clickabe-icon"
									src={Pause}
									alt="pause"
								/>
							</button>
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
