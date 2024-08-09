import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import { SelectedUsersContext } from '../../context/SelectedUserContext'
import { getCodeByUser } from '../../service/sessionService'
import { getAvatar } from '../../tool/Tools'
import '../../css/userswitch.scss'
import { Typography } from '@mui/material'

const UserSwitch = () => {
  const { selectedUsers } = useContext(SelectedUsersContext)
  const { selectedCode, setSelectedCode } = useContext(SelectedCodeContext)
  const { currentUser } = useContext(AuthContext)

  if (
    !selectedUsers ||
    selectedUsers.length === 0 ||
    selectedUsers[0] === null
  ) {
    return null
  }

  const handleImageClick = async (user) => {
    const code = await getCodeByUser(user.id)
    // const code = await getCodeById(user.code_id)
    setSelectedCode(code)
  }

  return (
    <div className="userSwitch">
      {selectedUsers.map((user, index) => (
        <React.Fragment key={index}>
          {' '}
          <img
            src={getAvatar(user?.avatar_url)}
            alt={user?.first_name}
            onClick={
              currentUser.role <= 2 ? () => handleImageClick(user) : null
            }
            className={selectedCode?.sender_id === user.id ? 'selected' : ''}
          />
          <span className="info-user">
            {user.first_name ? user.first_name : user.name}
          </span>
        </React.Fragment>
      ))}
    </div>
  )
}

export default UserSwitch
