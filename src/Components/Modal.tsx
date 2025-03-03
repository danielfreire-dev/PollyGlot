import { useState } from "react";

export default function Modal({ children }) {
	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<button className="modal-close-button" onClick={onClose}>
					&times;
				</button>
				{children}
			</div>
		</div>
	);
}
