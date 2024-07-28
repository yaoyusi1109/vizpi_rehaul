import React from 'react'
import { getAvatar } from '../../tool/Tools'

const Member = ({ user }) => {
  return (
    <div className="member">
      <div className="member_info">
        <img src={getAvatar(user?.avatar_url)} alt="" />
        <span>{user?.first_name}</span>
      </div>
      <div className="exercise_info">
        <span>passrate:</span>
        <span>{user?.progress?.passrate + '%'}</span>
      </div>
    </div>
  )
}

export default Member
