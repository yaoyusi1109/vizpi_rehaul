import React, { createContext, useState, useContext, useEffect } from "react";
import { SelectedGroupContext } from "./SelectedGroupContext";
import { SessionContext } from "./SessionContext";
import { getUsersInSession } from "../service/userService";
import { AuthContext } from "./AuthContext";
import { getInstructorBySessionId } from '../service/instructorService'

export const SelectedUsersContext = createContext();

export const SelectedUsersProvider = ({ children }) => {
	const [selectedUsers, setSelectedUsers] = useState(null);
	const { selectedGroup } = useContext(SelectedGroupContext);
	const { session } = useContext(SessionContext);
	const { currentUser } = useContext(AuthContext);

	useEffect(() => {
		const fetchUsers = async () => {
			if (selectedGroup && selectedGroup.user_ids) {
				try {
					let users = await getUsersInSession(
						session.id,
						selectedGroup.user_ids
					);
					
					const instructor = await getInstructorBySessionId(session.id)
					users.push(instructor)
					setSelectedUsers(users);
				} catch (error) {
					console.error("Failed to fetch users:", error);
				}
			}
		};
		fetchUsers();
	}, [selectedGroup, currentUser]);

	return (
		<SelectedUsersContext.Provider value={{ selectedUsers, setSelectedUsers }}>
			{children}
		</SelectedUsersContext.Provider>
	);
};
