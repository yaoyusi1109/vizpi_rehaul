import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { getAvatar } from '../../tool/Tools'
import Button from '@mui/joy/Button'
import { quitSession } from '../../service/sessionService'
import { SessionContext } from '../../context/SessionContext'
import TutorialModal from '../commonUnit/TutorialModal'
import { ModeContext } from '../../context/ModeContext'
import { signOut } from '../../service/authService'

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext)
  const { setSession } = useContext(SessionContext)
  const { Mode, setMode } = useContext(ModeContext)
  const handleSignOut = async () => {
    try {
      signOut()
      window.location.reload()
    } catch (err) {
      console.error('Failed to sign out:', err)
    }
  }

  const handleQuitSession = () => {
    quitSession(currentUser.id).then(() => {
      window.location.reload()
      setSession(null)
    })
  }

  return (
    <div className="user-profile">
      <img src={getAvatar(currentUser?.avatar_url)} alt="" />
      <span>{currentUser?.first_name}</span>

      <>
        {currentUser.role < 3 && (
          <div>
            <Button
              variant="outlined"
              color="neutral"
              selected={Mode}
              onClick={() => {
                setMode(!Mode)
              }}>
              Presenter View
            </Button>
            <Button
              className="btn"
              variant="outlined"
              color="neutral"
              onClick={handleQuitSession}>
              Session List
            </Button>
            <TutorialModal />
          </div>
        )}
        {currentUser.role < 3 && (
          <Button className="btn red" onClick={handleSignOut}>
            Sign Out
          </Button>
        )}
      </>
    </div>
  )
}

export default UserProfile
