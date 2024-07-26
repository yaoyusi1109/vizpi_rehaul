import React, { useContext, useEffect, useState } from 'react'
import { SelectedUsersContext } from '../../context/SelectedUserContext'
import Message from './Message'
import { AuthContext } from '../../context/AuthContext'
import { getUsersByGroupId } from '../../service/userService'
import { getInstructorBySessionId } from './../../service/instructorService'
import { SessionContext } from '../../context/SessionContext'

const Messages = ({ messages }) => {
  const { selectedUsers } = useContext(SelectedUsersContext)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  // const senderIds = [...new Set(messages.map((message) => message.sender_id))];
  const { currentUser } = useContext(AuthContext)
  const { session } = useContext(SessionContext)

  useEffect(() => {
    const fetchUser = async () => {
      if (selectedUsers) {
        setAllUsers(selectedUsers)
      } else {
        const usersInGroup = await getUsersByGroupId(currentUser.group_id)
        setAllUsers(usersInGroup)
      }
    }
    fetchUser()
  }, [messages, selectedUsers])

  if (session.type !== 'Vizmental') {
    if (!allUsers || allUsers.length === 0) {
      return <div>Loading...</div>
    }
  }

  return (
    <div className="messages">
      {messages.map((message, index) => {
        let user = null
        if (session.type !== 'Vizmental') {
          if (!allUsers || allUsers.length === 0) {
            return null
          }
          for (const member of allUsers) {
            if (member.id === message.sender_id) {
              user = member
              break
            }
          }
          if (!user) {
            user = session.instructor
          }
        } else {
          user = currentUser
        }

        const isSelected = selectedMessage === message
        return (
          <Message
            key={message.id}
            message={message}
            user={user}
            isSelected={isSelected}
            onSelect={() => setSelectedMessage(message)}
          />
        )
      })}
    </div>
  )
}

export default Messages
