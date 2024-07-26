import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import CreateSessionModal from './CreateSessionModal'
import { getSessionsByIds } from '../../service/sessionService'
import { setSessionInUser } from '../../service/userService'

const SessionMenu = () => {
  const [existingSessions, setExistingSessions] = useState([])
  const [selectedSessionId, setSelectedSessionId] = useState('')
  const [showModal, setShowModal] = useState(false)
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    getSessionsByIds(currentUser?.sessions).then((sessions) => {
      setExistingSessions(sessions)
    })
  }, [currentUser])

  const handleSessionChange = (event) => {
    setSelectedSessionId(event.target.value)
  }

  const handleSetSession = () => {
    setSessionInUser(currentUser.id, selectedSessionId).then(() => {
      window.location.reload()
    })
  }

  const handleCreateNewSession = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }
  if (!existingSessions) return <div>Loading...</div>

  return (
    <div className="session-menu">
      <h2>Select a Session</h2>
      <select value={selectedSessionId} onChange={handleSessionChange}>
        <option value={''}>{'Select a session'}</option>
        {existingSessions.map((session, index) => (
          <option key={index} value={session.id ? session.id : ''}>
            {session.subject}
          </option>
        ))}
      </select>

      <button onClick={handleSetSession}>Next</button>

      <h2>or</h2>

      <button onClick={handleCreateNewSession}>Create New Session</button>

      <CreateSessionModal showModal={showModal} onClose={handleCloseModal} />
    </div>
  )
}

export default SessionMenu
