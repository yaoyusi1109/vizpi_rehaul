import React, { createContext, useState, useContext, useEffect } from "react"
import { AuthContext } from "./AuthContext"
import { SessionContext } from "./SessionContext"
import {
	getGroupsBySession,
	listenToGroups,
	subscribeToGroups,
} from "../service/groupService"

export const GroupsContext = createContext()

export const GroupsProvider = ({ children, sessionId }) => {
	const [groupsInSession, setGroupsInSession] = useState([])
	const { currentUser } = useContext(AuthContext)
	const { session } = useContext(SessionContext)

	useEffect(() => {
		if (currentUser && currentUser.role < 3 && session && session.grouped) {
			console.log("Subscribing to groups")
			let unsubscribe = subscribeToGroups(session.id, setGroupsInSession)
			return () => unsubscribe()
		} else {
			setGroupsInSession([])
		}
	}, [session, currentUser])

	return (
		<GroupsContext.Provider value={{ groupsInSession, setGroupsInSession }}>
			{children}
		</GroupsContext.Provider>
	)
}
