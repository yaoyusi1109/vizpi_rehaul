import axios from "axios"
import { socket } from "../tool/socketIO"

const sessionUrl = process.env.REACT_APP_HOST_API + "/sessions"
const userUrl = process.env.REACT_APP_HOST_API + "/users"
const instructorUrl = process.env.REACT_APP_HOST_API + "/instructors"
const groupUrl = process.env.REACT_APP_HOST_API + "/groups"
const codeUrl = process.env.REACT_APP_HOST_API + "/codes"

export const getSessionById = async (id) => {
	if (!id) return null
	let session
	await axios
		.get(sessionUrl + "/" + id)
		.then((response) => {
			session = response.data.session
		})
		.catch((error) => {
			throw error
		})
	return session
}

export const getSessionTasksByCreaterId = async (createrId) => {
	if (!createrId) return null
	let tasks
	await axios
		.get(sessionUrl + "/tasks/createrId/" + createrId)
		.then((response) => {
			tasks = response.data.tasks
		})
		.catch((error) => {
			throw error
		})
	return tasks
}

export const updateTaskInSession = async (sessionId, task) => {
	if (!sessionId || !task) {
		return false
	}
	try {
		return await axios
			.put(sessionUrl + "/" + sessionId, {
				session: {
					task: task,
				},
			})
	}
	catch (error) {
		console.error(error)
		return false
	}
}

export const IncrementStuNumInSession = async (sessionId) => {
	if (!sessionId) {
		return false
	}
	try {
		return await axios
			.put(sessionUrl + "/incStu/" + sessionId)
	}
	catch (error) {
		console.error(error)
		return false
	}
}

export const addQuizInSession = async (sessionId, quiz) => {
	if (!sessionId || !quiz) {
		return false
	}
	try {
		return await axios
			.put(sessionUrl + "/" + sessionId, {
				session: {
					quiz: quiz,
				},
			})
	}
	catch (error) {
		console.error(error)
		return false
	}
}


export const setEnableQuizInSession = async (sessionId, quizEnable) => {
	if (!sessionId || quizEnable === undefined) {
		return false
	}
	try {
		return await axios
			.put(sessionUrl + "/" + sessionId, {
				session: {
					enable_quiz: quizEnable,
				},
			}).then((response) => {
				return response.data.session[1][0].enable_quiz
			})
	}
	catch (error) {
		console.error(error)
		return false
	}
}

export const addSession = async (crn, task, subject, type, creater_id) => {
	const newSession = {
		time: new Date(),
		crn: crn,
		creater_id: creater_id,
		task: task,
		subject: subject,
		enable_chat: type === "Helper/Helpee" || type === "Audio" || type === "Vizmental" ? true : false,
		grouped: type === "Helper/Helpee" || type === "Audio" ? true : false,
		stu_num: 0,
		group_round: 0,
		regrouping: false,
		type: type,
	}

	let session = null
	await axios
		.post(sessionUrl, {
			session: newSession,
		})
		.then((response) => {
			session = response.data.session
		})
		.catch((error) => {
			console.error(error)
		})
	return session
}

export const getUsersSortedByProgress = async (session) => {
	if (!session) return []
	let toReturn = null
	await axios
		.get(userUrl + "/session/" + session.id)
		.then((response) => {
			//console.log(response)
			toReturn = response.data
		})
		.catch((error) => {
			console.error(error)
			toReturn = []
		})
	return toReturn
}

export const groupingInSession = async (session, type, baseGroupSize = 3) => {
	if (baseGroupSize <= 0) return false

	try {
		const response = await axios.get(
			sessionUrl + "/" + session.id + "/grouping"
		)
		return response.data.groups !== null
	} catch (error) {
		console.error(error)
		return false
	}
}

export const regrouping = async (session, baseGroupSize) => {
	if (baseGroupSize <= 0) return false

	try {
		const response = await axios.post(
			sessionUrl + "/" + session.id + "/regroup", {
			"baseGroupSize": baseGroupSize,
			"round": 2
		}
		)

		console.log("regrouping", response)
		return response.data.groups

	} catch (error) {
		console.error(error)
		return false
	}
}

export const groupManual = async (session, userIds, name) => {
	//console.log(session.id)
	//console.log(userIds)
	//console.log(name)
	const group = {
		ids: userIds,
		name: name,
	}
	try {
		const response = await axios.post(
			sessionUrl + "/" + session.id + "/groupManual", {
			"ids": userIds,
			"name": name
		}
		)
		return response.data.groups !== null
	} catch (error) {
		console.error(error)
		return false
	}
}

export const addToGroup = async (session, userId) => {
	console.log(session.id)
	console.log(userId)
	try {
		const response = await axios.post(
			sessionUrl + "/" + session.id + "/lateGroup", {
			"id": userId,
		}
		)
		return response.data.groups
	} catch (error) {
		console.error(error)
		return false
	}
}

export const quitSession = async (userId) => {
	if (!userId) return null
	await axios.put(instructorUrl + "/" + userId, {
		instructor: {
			id: userId,
			current_session: null,
		},
	})
}

export const quitSessionStudent = async (userId) => {
	if (!userId) return null
	await axios.put(userUrl + "/" + userId, {
		user: {
			id: userId,
			session_id: null,
		},
	})
}

export const getSessionsByIds = async (sessionIds) => {
	if (!sessionIds) return []
	let sessions = []
	await axios
		.post(sessionUrl + "/ids", {
			ids: sessionIds,
		})
		.then((response) => {
			sessions = response.data
		})
		.catch((error) => {
			console.error(error)
			return []
		})
	return sessions
}

export const setSessionEnableChat = async (sessionId, enableChat) => {
	if (!sessionId || enableChat === undefined) return false
	axios
		.put(sessionUrl + "/" + sessionId, {
			session: {
				enable_chat: enableChat,
			},
		})
		.then((response) => {
			return response.data.session[1][0].enable_chat
		})
		.catch((error) => {
			console.error(error)
			return false
		})
}
export const setSessionEnableChatAndCloseSession = async (sessionId, enableChat, closeSessionType) => {
	if (!sessionId || enableChat === undefined) return false;

	try {
		const response1 = await axios.put(sessionUrl + "/" + sessionId, {
			session: {
				enable_chat: enableChat,
			},
		});
		const response2 = await axios.put(sessionUrl + "/" + sessionId + "/endChat", {
			closeSessionType: closeSessionType
		});
		return response1.data.session[1][0].enable_chat;
	} catch (error) {
		console.error(error);
		return false;
	}
};


export const setSessionRegrouping = async (sessionId, regrouping) => {
	if (!sessionId || regrouping === undefined) return false
	axios
		.put(sessionUrl + "/" + sessionId, {
			session: {
				regrouping: regrouping,
			},
		})
		.then((response) => {
			return response.data.session[1][0].regrouping
		})
		.catch((error) => {
			console.error(error)
			return false
		})
}

export const setSessionGroupRound = async (sessionId, group_round) => {
	if (!sessionId || group_round === undefined) return false
	axios
		.put(sessionUrl + "/" + sessionId, {
			session: {
				group_round: group_round,
			},
		})
		.then((response) => {
			return response.data.session[1][0].group_round
		})
		.catch((error) => {
			console.error(error)
			return false
		})
}

export const removeGroupingInSession = async (session) => {
	try {
		const response = await axios.delete(groupUrl + "/session/" + session.id)
		return response.data.groupsRemoved
	} catch (error) {
		throw error
	}
}

export const getCodeByUser = async (userId) => {
	if (!userId) {
		return null
	}
	axios
		.get(codeUrl + "/user/" + userId)
		.then((response) => {
			return response.data
		})
		.catch((error) => {
			console.error(error)
			return null
		})
}

export const deleteSession = async (instructorId, sessionId, sessions) => {
	if (!sessionId) return false
	try {
		await axios.put(instructorUrl + "/" + instructorId, {
			instructor: {
				id: instructorId,
				session_list: sessions,
			},
		})
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

export const updateTestInSession = async (sessionId, test) => {
	if (!sessionId || !test) {
		//console.log("can't update")
		return false
	}

	axios
		.put(sessionUrl + "/" + sessionId, {
			session: {
				test_cases: test,
			},
		})
		.then((response) => {
			return true
		})
		.catch((error) => {
			console.error(error)
			return false
		})
}

export const updateIdentityListInSession = async (sessionId, identityList) => {
	if (!sessionId || !identityList) {
		//console.log("Can't update, sessionId or testList is missing.")
		return false
	}

	const session = {
		identity_list: identityList,
	}
	try {
		await axios.put(sessionUrl + "/" + sessionId, {
			session: session,
		})

		return true
	} catch (error) {
		console.error("Error updating identityList:", error)
		return false
	}
}

export const updateStarterCodeInSession = async (sessionId, starterCode) => {
	if (!sessionId || !starterCode) {
		//console.log("can't update")
		return false
	}

	axios
		.put(sessionUrl + "/" + sessionId, {
			session: {
				test_code: starterCode,
			},
		})
		.then((response) => {
			return true
		})
		.catch((error) => {
			console.error(error)
			return false
		})
}

export const addUserToSession = async (sessionId, userName) => {
	if (!sessionId || !userName) {
		//console.log("can't update")
		return false
	}
}

export const generateUserInSession = async (sessionId) => {
	if (!sessionId) {
		//console.log("can't update")
		return false
	}
	for (let i = 0; i < 10; i++) {
		addUserToSession(sessionId, "user" + i)
	}
}

export const checkUserInSession = async (sessionId, userId) => {
	axios
		.get(userUrl + userId)
		.then((response) => {
			if (response.data.session_id === sessionId) {
				return true
			}
			return false
		})
		.catch((error) => {
			return false
		})
}

export const subscribeSession = (sessionId, updateSession) => {
	socket.emit("subscribe session", sessionId)

	socket.on("update session", (res) => {
		//console.log(res.data)
		updateSession(res.data)
	})

	socket.on("disconnect", () => {
		//console.log("disconnected from session service")
	})

	const handleUpdateSession = (res) => {
		//console.log(res.data)
		updateSession(res.data)
	}

	return () => {
		socket.off("update session", handleUpdateSession)
	}
}

export const duplicateSession = async (sessionId, newSubject) => {
	try {
		let res = await axios.post(sessionUrl + "/" + sessionId + "/duplicate", {
			"subject": newSubject
		})
		return res.data.session
	} catch (error) {
		console.error(error)
		return null
	}
}

export const getAllTopicsInSession = async (sessionId) => {
	try {
		const res = await axios.get(sessionUrl + "/" + sessionId + "/topics")
		return res.data
	} catch (error) {
		console.error(error)
		return []
	}
}

export const renewTopics = async (sessionId) => {
	try {
		return await axios.get(sessionUrl + "/" + sessionId + "/renewTopics")
	} catch (error) {
		console.error(error)
	}
}