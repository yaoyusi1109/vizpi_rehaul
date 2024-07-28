import React, { useContext } from 'react'
import { Paper, Typography , Button} from '@mui/material'
import { AuthContext } from '../context/AuthContext'
import Loading from '../component/commonUnit/Loading'
import SessionTable from '../component/session/SessionTable'
import UserProfileSession from '../component/topBar/UserProfileSession'

const Session = () => {
  const { currentUser } = useContext(AuthContext)

  if (!currentUser) return <Loading />

  return (
    <div className="session">
      <Paper elevation={3} className="session-form">
  <div className="session-header">
    <div className = "session-menu">
    <Typography
      variant="h6"
      noWrap
      component="a"
      href="/"
      sx={{
        display: 'block',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.1rem',
        color: 'white',
        textDecoration: 'none',
        margin: '0.5em',
      }}>
      VizPI
    </Typography>
    <Button
    href="/"
      sx={{ my: 2, color: 'white', display: 'block' }}>
      Session List
    </Button>
    </div>
    <UserProfileSession />
  </div>
  <SessionTable />
</Paper>
    </div>
  )
}

export default Session
