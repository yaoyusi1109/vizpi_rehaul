import React, { useContext, useState } from 'react'
import '../../css/audio/audioGroupInput.scss'
import { Tooltip, IconButton } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { AuthContext } from '../../context/AuthContext'
import { SessionContext } from '../../context/SessionContext'
import { addUserToGroup } from '../../service/groupService'
import { SelectedGroupContext } from '../../context/SelectedGroupContext'

const GroupInputComponent = () => {
  const { session } = useContext(SessionContext)
  const { currentUser } = useContext(AuthContext)
  const [groupNum, SetGroupNum] = useState('')
  const { setSelectedGroup } = useContext(SelectedGroupContext)

  const handleSubmit = async () => {
    try {
      let num = parseInt(groupNum)
      const group = await addUserToGroup(session.id, num, currentUser.id)
      setSelectedGroup(group)
    } catch (e) {
      console.log(e)
    }
  }

  const handleKeyDown = (event) => {
    if (
      event.key === 'e' ||
      event.key === '.' ||
      event.key === '-' ||
      event.key === '+'
    ) {
      event.preventDefault()
    }
  }

  const handleChange = (event) => {
    const { value } = event.target
    const newValue = value.replace(/[^0-9]/g, '')
    event.target.value = newValue
    SetGroupNum(newValue)
  }

  return (
    <div className="room-input-container">
      <div className="guidance-image">
        <img src="/path/to/your/guidance-image.png" alt="Guidance" />
      </div>
      <div className="input-wrapper">
        <input
          type="number"
          className="room-input"
          placeholder="Enter Room Number"
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />

        <Tooltip title="Please enter your Zoom group number." arrow>
          <IconButton className="info-icon">
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </div>
      <button className="submit-button" onClick={handleSubmit}>
        Enter
      </button>
    </div>
  )
}

export default GroupInputComponent
