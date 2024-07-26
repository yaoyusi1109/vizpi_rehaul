const axios = require("axios")
const userUrl = process.env.REACT_APP_HOST_API + "/users"
const instructorUrl = process.env.REACT_APP_HOST_API + "/instructors"

export const getUserById = async (id) => {
	if (!id) return null

	let res = null
	try {
		const response = await axios.get(userUrl + "/" + id)
		res = response.data
		return res
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const getUserByEmail = async (email) => {
	if (!email) return null

	let res = null
	try {
		const response = await axios.post(userUrl + "/email",{ email })
		res = response.data
		return res
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const getUsersByIds = async (ids) => {
	if (!ids) return null
	try {
		const response = await axios.post(userUrl + "/ids", { ids })
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const getUsersByGroupId = async (groupId) => {
	if (!groupId) return null
	try {
		const response = await axios.get(userUrl + "/group/" + groupId)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const setSessionInUser = async (userId, sessionId) => {
	if (!userId || !sessionId) return null
	//console.log("setSessionInUser", userId, sessionId)
	let res = false
	await axios
		.put(instructorUrl + "/" + userId, {
			instructor: {
				id: userId,
				current_session: sessionId,
			},
		})
		.then((response) => {
			res = true
		})
		.catch((error) => {
			console.error(error)
		})
	return res
}
export const setSessionInStudent = async (userId, sessionId) => {
	if (!userId || !sessionId) return null
	//console.log("setSessionInUser", userId, sessionId)
	let res = false
	await axios
		.put(userUrl + "/" + userId, {
			user: {
				id: userId,
				session_id: sessionId,
			},
		})
		.then((response) => {
			res = true
		})
		.catch((error) => {
			console.error(error)
		})
	return res
}

export const updateUser = async (user) => {
	if (!user) return null
	//console.log("setSessionInUser", userId, sessionId)
	let res = false
	await axios
		.put(userUrl + "/" + user.id, { user })
		.then((response) => {
			res = true
		})
		.catch((error) => {
			console.error(error)
		})
	return res
}

export const addQuizStatsInUser = async (userId, quizStats) => {
	if (!userId || !quizStats) return null;
	//console.log("addQuizStatsInUser", userId, quizStats);
	try {
	  const response = await axios.put(userUrl + "/" + userId, {
		user: {
		  id: userId,
		  quiz_stats: quizStats,
		}
	  });
	  return response.data;
	} catch (error) {
	  console.error(error);
	  return false;
	}
  };

export const getUserInSession = async (sessionId, userId) => {
	if (!sessionId || !userId) return null
	getUserById(userId)
}

export const getUsersInSession = async (sessionId, userIds) => {
	if (!sessionId || !userIds) return null
	return getUsersByIds(userIds)
}

export const getAllUsersInSession = async (sessionId) => {
	if (!sessionId) return null
	try {
		const response = await axios.get(userUrl + "/session/" + sessionId)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

// export const setPassrateInUser = async (sessionId, userId, passrate) => {
//   const userRef = doc(db, 'session', sessionId, 'users', userId)
//   await updateDoc(userRef, { 'progress.passrate': passrate })

// }
