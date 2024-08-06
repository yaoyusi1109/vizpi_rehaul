import React, { useContext, useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import { AuthContext } from '../../context/AuthContext'
import FixTaskModal from '../commonUnit/FixTaskModal'

const AddSessionDialog = ({ open, setOpen, handleAddSession }) => {
  const { currentUser } = useContext(AuthContext)
  const [generateDescription, setGenerateDescription] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newSession, setNewSession] = useState({
    subject: '',
    crn: '',
    task: '',
    type: '',
  })

  useEffect(() => {
    if (!isModalOpen && generateDescription !== '') {
      setNewSession({ ...newSession, task: generateDescription })
    }
  }, [generateDescription, isModalOpen])

  const handleChange = (e) => {
    setNewSession({ ...newSession, [e.target.name]: e.target.value })
  }
  const handleAISuggestion = () => {
    setGenerateDescription(newSession.task)
    setIsModalOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
    setNewSession({
      subject: '',
      crn: '',
      task: '',
    })
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Add New Session</DialogTitle>
      <DialogContent style={{ minHeight: '300px' }}>
        <TextField
          autoFocus
          margin="dense"
          name="crn"
          label="CRN"
          type="text"
          fullWidth
          value={newSession.crn}
          onChange={handleChange}
        />
        <TextField
          autoFocus
          margin="dense"
          name="subject"
          label="Subject"
          type="text"
          fullWidth
          value={newSession.subject}
          onChange={handleChange}
        />
        <FormControl fullWidth variant="outlined" className="form-control">
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            className="type-select"
            labelId="type-label"
            value={newSession.type}
            onChange={handleChange}
            name="type"
            label="Type">
            <MenuItem value={'Auto Grouping'}>Auto Grouping</MenuItem>
            <MenuItem value={'Audio'}>Audio</MenuItem>
            <MenuItem value={'Helper/Helpee'}>Helper/Helpee</MenuItem>
            <MenuItem value={'Blockly'}>Blockly</MenuItem>
			      <MenuItem value={'Blockly Shared'}>Blockly Shared</MenuItem>
            <MenuItem value={'Vizmental'}>Vizmental</MenuItem>
            {/* 
						<MenuItem value={'Peer Instruction'}>Peer Instruction</MenuItem> */}
          </Select>
        </FormControl>
        <TextField
          // autoFocus={aiGenerate}
          margin="dense"
          name="task"
          label={'Task'}
          type="text"
          fullWidth
          multiline
          rows={6}
          value={newSession.task}
          onChange={handleChange}
          placeholder={''}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleAISuggestion()} color="primary">
          AI Assistant
        </Button>
        <Button onClick={() => handleCloseDialog()} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleAddSession(newSession)} color="primary">
          Add
        </Button>
      </DialogActions>
      {isModalOpen && (
        <FixTaskModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          taskContent={generateDescription}
          setTaskContent={setGenerateDescription}
        />
      )}
    </Dialog>
  )
}

export default AddSessionDialog
