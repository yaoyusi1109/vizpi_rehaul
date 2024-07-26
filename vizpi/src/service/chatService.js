import { socket } from "../tool/socketIO"

const axios = require("axios")
const messageUrl = process.env.REACT_APP_HOST_API + "/chat"


// -1 is message to group
// -2 is message to class
// -3 is private message to instructor
const REVEIVER_TYPE = {
	GROUP: -1,
	CLASS: -1,
	INSTRUCTOR: -1,
	AI: -4
}

export const sendMessageToGroup = async (content, user, groupId, keystrokes) => {
	if (!content || content === "" || !user || !user.session_id || !groupId)
		return null
	const messageData = {
		group_id: groupId,
		sender_id: user.id,
		session_id: user.session_id,
		code_id: user.code_id,
		content: content,
		recipient_id: REVEIVER_TYPE.GROUP,
		keystrokes: keystrokes
	}
	//console.log("message sent",messageData)
	return axios
		.post(messageUrl, messageData)
		.then((response) => {
			return response.data.message
		})
		.catch((error) => {
			console.error(error)
		})
}

export const sendMessageToAllGroup = async (content, user, keystrokes) => {
	if (!content || content === "" || !user || !user.session_id) return null

	const messageData = {
		group_id: REVEIVER_TYPE.CLASS,
		sender_id: user.id,
		session_id: user.session_id,
		content: content,
		code_id: user.code_id,
		// recipient_id == -2 when this message send to class (all group)
		recipient_id: REVEIVER_TYPE.CLASS,
		keystrokes: keystrokes
	}

	return axios
		.post(messageUrl, messageData)
		.then((response) => {
			return response.data.message
		})
		.catch((error) => {
			console.error(error)
		})
}

export const getMessagesByGroup = async (groupId) => {
	try {
		const response = await axios.get(messageUrl + "/group/" + groupId)
		return response.data.messages
	} catch (error) {
		//console.log(error)
	}
}

export const getMessagesBySession = async (sessionId) => {
	try {
		const response = await axios.get(messageUrl + "/session/" + sessionId)
		return response.data.messages
	} catch (error) {
		//console.log(error)
	}
}

export const sendMessageToAI = async (content, user, keystrokes) => {
	if (!content || content === "" || !user || !user.session_id) return null
	// console.log("qt",question_type)

	const messageData = {
		group_id: REVEIVER_TYPE.AI,
		sender_id: user.id,
		session_id: user.session_id,
		content: content,
		code_id: user.code_id,
		// recipient_id == -2 when this message send to class (all group)
		recipient_id: REVEIVER_TYPE.AI,
		keystrokes: keystrokes
	}

	return axios
		.post(messageUrl, messageData)
		.then((response) => {
			return response.data.message
		})
		.catch((error) => {
			console.error(error)
		})
}

export const sendAIResponseToUser = async (content, user, keystrokes) => {
	if (!content || content === "" || !user || !user.session_id){
		//console.log("content", content, "user", user, "session_id", user.session_id)
	return null
	}

	const messageData = {
		group_id: REVEIVER_TYPE.AI,
		sender_id: REVEIVER_TYPE.AI,
		session_id: user.session_id,
		content: content,
		code_id: user.code_id,
		recipient_id: user.id,
		keystrokes: keystrokes
	}

	return axios
		.post(messageUrl, messageData)
		.then((response) => {
			return response.data.message
		})
		.catch((error) => {
			console.error(error)
		})
}

export const getMessagesBetweenUserAndAI = async (userId) => {
	if(!userId) return null
	try {
		const response = await axios.get(messageUrl + "/ai/" + userId)
		return response.data.messages
	} catch (error) {
		//console.log(error)
	}

}

export const subscribeToAIMessage = (userId, updateMessages) => {
    const fetchInitialMessages = async () => {
        const messages = await getMessagesBetweenUserAndAI(userId);
        updateMessages(messages);
    };

    fetchInitialMessages();

    const updateMessageHandler = (message) => {
        updateMessages((prevMessages) => {
            let newMessages = [...prevMessages];
            
            newMessages.push(message.data);
            
            return newMessages;
        });
    };

    socket.emit('subscribe ai', userId);
    socket.on('update ai message', updateMessageHandler);

    return () => {
        socket.off('update ai message', updateMessageHandler);
        socket.emit('unsubscribe ai', userId);
    };
};

export const subscribeToAIMessageInSession = (sessionId, updateMessages) => {
    const fetchInitialMessages = async () => {
        const messages = await getMessagesBySession(sessionId);
        updateMessages(messages);
    };

    fetchInitialMessages();

    const updateMessageHandler = (message) => {
        updateMessages((prevMessages) => {
            let newMessages = [...prevMessages];
            
            newMessages.push(message.data);
            
            return newMessages;
        });
    };

    socket.emit('subscribe ai', sessionId);
    socket.on('update ai message', updateMessageHandler);

    return () => {
        socket.off('update ai message', updateMessageHandler);
        socket.emit('unsubscribe ai', sessionId);
    };
};