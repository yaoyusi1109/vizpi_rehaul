import React, { createContext, useState, useEffect, useContext } from "react"
import { getGroupByUser } from "../service/groupService"
import { AuthContext } from "./AuthContext"
import { SessionContext } from "./SessionContext"

export const SelectedGroupContext = createContext()

export const SelectedGroupProvider = ({ children }) => {
	const [selectedGroup, setSelectedGroup] = useState(null)
	const [waiting, setWaiting] = useState(false)
	const { currentUser } = useContext(AuthContext)
	const { session } = useContext(SessionContext)

	useEffect(() => {
		const fetchGroup = async () => {
			if (!selectedGroup && currentUser && session && session.grouped) {
				if (currentUser.role === 3) {
					const group = await getGroupByUser(currentUser.id,session.id)
					console.log('selected', group)
					setSelectedGroup(group)
				}
			}
		}
		fetchGroup()
	}, [currentUser, session])

	return (
		<SelectedGroupContext.Provider value={{ selectedGroup, setSelectedGroup, waiting, setWaiting }}>
			{children}
		</SelectedGroupContext.Provider>
	)
}
