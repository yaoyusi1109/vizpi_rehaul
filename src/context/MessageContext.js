import React, { useEffect, useState } from "react";
import { getMessagesBySession } from "../service/chatService";

export const MessageContext = React.createContext();

export const MessageProvider = ({ children, sessionId }) => {
	const [chatMessage, setChatMessage] = useState("");

	

	return (
		<MessageContext.Provider value={{ chatMessage, setChatMessage }}>
			{children}
		</MessageContext.Provider>
	);
};
