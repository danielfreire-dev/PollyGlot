import React from "react";

export default function MessageBubble({
	role,
	message,
}: {
	role: "user" | "system";
	message: string;
}) {
	return (
		<div className={role}>
			<div className={"messagetext"}>{message}</div>
		</div>
	);
}
