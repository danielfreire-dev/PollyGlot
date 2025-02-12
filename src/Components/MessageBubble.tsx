import React from "react";

export default function MessageBubble({
	role,
	message,
}: {
	role: "user" | "system" | "error";
	message: string | null;
}) {
	return (
		<>
			<p className={`${role} messagetext`}>{message}</p>
		</>
	);
}
