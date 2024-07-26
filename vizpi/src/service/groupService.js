import { update } from "immutable"
import { socket } from "../tool/socketIO"
import { getConversationProgress } from "../tool/progressUnit"

const axios = require("axios")
const groupUrl = process.env.REACT_APP_HOST_API + "/groups"
const sessionUrl = process.env.REACT_APP_HOST_API + "/sessions"
const chatUrl = process.env.REACT_APP_HOST_API + "/chat"

export const getGroupById = async (groupId) => {
	if (!groupId) return null
	try {
		let res = await axios
			.get(groupUrl + "/" + groupId)
		return res.data.group
	} catch (e) {
		console.error(e)
	}
}


export const getGroupsBySession = async (sessionId) => {
	if (!sessionId) return null

	try {
		let res = await axios
			.get(sessionUrl + "/" + sessionId + "/groups")
		return res.data.groups
	} catch (e) {
		console.error(e)
	}
}

export const getGroupByUser = async (userId, sessionId) => {
	if (!userId) return null

	try {
		let res = await axios
			.get(groupUrl + "/user/" + userId + "/" + sessionId)
		return res.data.group
	} catch (e) {
		console.log(e)
	}
}

export const getGroupsByUser = async (userId, sessionId) => {
	if (!userId || !sessionId) return null

	try {
		let res = await axios
			.get(groupUrl + "/users/" + userId + "/" + sessionId)
		return res.data.group
	} catch (e) {
		console.error(e)
	}
}

export const addReaction = async (messageId, reaction) => {
	if (!messageId || !reaction) return null
	try {
		let res = await axios
			.put(chatUrl + "/" + messageId + "/reaction", { reaction })
		//console.log(res.data)
		return res.data
	} catch (e) {
		console.error(e)
	}
}

export const updateGroupCode = async (groupId, codeId) => {
	if (!groupId || !codeId) return null
	const group = {
		code_id: codeId,
	}
	try {
		await axios.put(groupUrl + "/" + groupId, {
			group: group,
		})

		return true
	} catch (error) {
		console.error("Error updating identityList:", error)
		return false
	}
}

export const removeReaction = async (user, groupId, oldMessageIndex) => {
	// if (!user || !user.session_id || !groupId) return null

	// const groupRef = doc(db, "session", user.session_id, "groups", groupId)

	// try {
	// 	const groupSnap = await getDoc(groupRef)
	// 	if (!groupSnap.exists()) {
	// 		throw new Error("Group not found")
	// 	}

	// 	const groupData = groupSnap.data()
	// 	const messages = groupData.messages || []

	// 	if (messages[oldMessageIndex]) {
	// 		messages[oldMessageIndex].reactions =
	// 			messages[oldMessageIndex].reactions || {}
	// 		messages[oldMessageIndex].reactions[user.first_name] = null
	// 	} else {
	// 		console.error("Message not found at index:", oldMessageIndex)
	// 		return
	// 	}

	// 	await updateDoc(groupRef, { messages })
	// } catch (error) {
	// 	console.error("Error updating reaction in message: ", error)
	// }
}

export const getParticipationByUserId = (messages, userId) => {
	if (!messages || messages.length == 0 || !userId) return 0

	const participation = messages.filter(
		(message) => message.sender_id === userId
	)
	return Math.round((participation.length * 100) / messages.length)
}

export const subscribeToGroups = (sessionId, updateGroups) => {
	getGroupsBySession(sessionId).then(groups => {
		updateGroups(groups)
	})
	socket.emit('subscribe groups', sessionId)

	const updateGroupHandler = (message) => {
		//console.log("update groups")
		let groupIndex
		updateGroups((prevGroups) => {
			if (!message || !message.operation || !message.data) return prevGroups
			groupIndex = prevGroups?.findIndex(g => g.id === message.data.group_id)
			if (groupIndex !== -1) {
				if (message.operation === "INSERT") {
					message = message.data
					let newGroups = [...prevGroups]
					let group = newGroups[groupIndex]
					group.messages.push(message)
					group.passrate.conversation = getConversationProgress(group.messages)
					newGroups[groupIndex] = group
					return newGroups
				} else if (message.operation === "UPDATE") {
					message = message.data
					const newGroups = [...prevGroups]
					let group = newGroups[groupIndex]
					let messageIndex = group.messages.findIndex(m => m.id === message.id)
					group.messages[messageIndex] = message
					newGroups[groupIndex] = group
					return newGroups
				} else if (message.operation === "DELETE") {
					message = message.data
					const newGroups = [...prevGroups]
					let group = newGroups[groupIndex]
					let messageIndex = group.messages.findIndex(m => m.id === message.id)
					group.messages.splice(messageIndex, 1)
					return newGroups
				}
			} else {
				return prevGroups
			}
		})
		if (groupIndex === -1) {
			getGroupsBySession(sessionId).then(groups => {
				updateGroups(groups)
			})
		}
	}
	const updateGroupsHandler = (group) => {
		console.log("update groups", group)
		updateGroups((prevGroups) => {
			if (!group.data || !group.data.id || group.data.session_id != sessionId) return prevGroups
			let groupIndex = prevGroups?.findIndex(g => g.id === group.data.id)
			if (groupIndex !== -1) {
				if (group.operation === "INSERT") {
					let newGroups = [...prevGroups]
					newGroups.push(group.data)
					return newGroups
				} else if (group.operation === "UPDATE") {
					let newGroups = [...prevGroups]
					newGroups[groupIndex] = group.data
					return newGroups
				} else if (group.operation === "DELETE") {
					let newGroups = [...prevGroups]
					newGroups.splice(groupIndex, 1)
					return newGroups
				}
			} else {
				return prevGroups
			}
		})

	}
	socket.on('update message', updateGroupHandler)
	//socket.on('update group', updateGroupsHandler)
	return () => {
		socket.off('update message', updateGroupHandler)
		socket.emit('unsubscribe groups', sessionId)
	}
}

export const subscribeToGroupMessage = (userId, groupId, updateMessages, setSelectedGroup) => {
	let group
	if (groupId != null) {
		group = getGroupById(groupId).then(group => {
			updateMessages(group?.messages)
		})
	} else if (userId != -1) {
		group = getGroupByUser(userId).then(group => {
			console.log(group)
			updateMessages(group?.messages)
		})
	}
	socket.emit('subscribe group', groupId)
	const updateMessageHandler = (message) => {
		//console.log("update")
		if (message.data.recipient_id > 0 &&
			message.data.recipient_id != userId &&
			message.data.sender_id != userId) return
		updateMessages((prevMessages) => {
			if (!message || !message.operation || !message.data) return
			let newMessages = [...prevMessages]
			if (message.operation === "INSERT") {
				message = message.data
				newMessages.push(message)
				return newMessages
			} else if (message.operation === "UPDATE") {
				message = message.data
				let messageIndex = prevMessages.findIndex(m => m.id === message.id)
				newMessages[messageIndex] = message
				return newMessages
			} else if (message.operation === "DELETE") {
				message = message.data
				let messageIndex = prevMessages.findIndex(m => m.id === message.id)
				newMessages.splice(messageIndex, 1)
				return newMessages
			}
		})
	}
	const updateMyGroupHandler = (res) => {
		if (res.data.id != groupId) return
		// console.log(groupId)
		// console.log(res.data)
		if (setSelectedGroup != null)
			setSelectedGroup(res.data)
	}
	socket.on('update message', updateMessageHandler)
	socket.on('update group', updateMyGroupHandler)
	return () => {
		socket.off('update message', updateMessageHandler)
		socket.off('update group', updateMyGroupHandler)
		socket.emit('unsubscribe group', groupId)
	}
}

export const getTopicsByGroupId = async (groupId) => {
	if (!groupId) return null
	try {
		let res = await axios
			.get(groupUrl + "/" + groupId + "/topics")
		return res.data.metadata
	} catch (e) {
		console.error(e)
	}
}

export const addUserToGroup = async (sessionId, groupNum, userId) => {
	if (!sessionId || !groupNum || !userId) return null
	try {
		let res = await axios.post(groupUrl + "/adduser", {
			sessionId: sessionId,
			groupNum: groupNum,
			userId: userId
		})
		return res.data
	} catch (e) {
		console.error(e)
		throw e
	}
}

export const removeUserFromGroup = async (groupId, userId) => {
	if (!groupId || !userId) return null
	try {
		let res = await axios.delete(`${groupUrl}/${groupId}/removeuser/${userId}`, {
			userId: userId
		})
		console.log(res.data)
		return res.data
	} catch (e) {
		console.error(e)
	}
}