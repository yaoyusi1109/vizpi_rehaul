import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useEffect } from 'react'
// import { getCourseList } from '../../service/courseService'

const DuplicateSessionDialog = ({
  open,
  setOpen,
  currSession,
  handleDuplicateSession,
  session,
}) => {
  const [newSession, setNewSession] = useState({
    subject: 'Copy of ' + session.subject,
    crn: session.crn,
    task: session.task,
  })
  // const [courseNumbers, setCourseNumbers] = useState([])

  // useEffect(() => {
  //   const fetchCourseNumbers = async () => {
  //     getCourseList().then((courseNumbers) => {
  //       setCourseNumbers(courseNumbers)
  //     })
  //   }
  //   fetchCourseNumbers()
  // }, [])

  const handleChange = (e) => {
    setNewSession({ ...newSession, [e.target.name]: e.target.value })
  }

  return (
    <Dialog
      fullWidth
      open={open && session == currSession}
      onClose={() => setOpen(false)}>
      <DialogTitle>Duplicate Session</DialogTitle>
      <DialogContent>
        <TextField
          className="textField"
          variant="outlined"
          autoFocus
          margin="dense"
          name="subject"
          label="Name"
          type="text"
          fullWidth
          value={newSession.subject}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => handleDuplicateSession(newSession, session)}
          color="primary">
          Duplicate
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DuplicateSessionDialog
