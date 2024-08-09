import React, { useContext, useState, useRef, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { updateTaskInSession } from '../../service/sessionService'
import { Button, Typography, Box, Modal,Grid } from '@mui/material'
import { SessionContext } from '../../context/SessionContext'
import '../../css/taskcard.scss'

import { generateAudioTask, generateTask } from '../../tool/generateTask'

const FixTaskModal = ({
  isModalOpen,
  setIsModalOpen,
  taskContent,
  setTaskContent,
}) => {
  const { currentUser } = useContext(AuthContext)
  const { session } = useContext(SessionContext)
  const [refinedTask, setRefinedTask] = useState('')
  const [loading, setLoading] = useState(true)
  const refinedTextAreaRef = useRef()

  useEffect(() => {
    if (!taskContent) setLoading(true)
    fixDescription()
  }, [taskContent])

  const highlightAddedContent = (original, refined) => {
    const originalWords = original.split(' ')
    const refinedWords = refined.split(' ')

    const highlightedContent = refinedWords.map((word, index) => {
      if (!originalWords.includes(word)) {
        return `<span style="color: green;">${word}</span>`
      }
      return word
    })

    return highlightedContent.join(' ')
  }

  const fixDescription = async () => {
    setRefinedTask('')
    setLoading(true)

    try {
      if (taskContent !== '') {
        if (session?.type === 'Audio') {
          const refinedTask = await generateAudioTask(taskContent)
          setRefinedTask(refinedTask)
          setLoading(false)
        } else {
          const refinedTask = await generateTask(taskContent)
          setRefinedTask(refinedTask)
          setLoading(false)
        }
      }
    } catch (error) {
      alert('Failed to generate task. Please try again.')
      console.error('Error generating task:', error)
      handleCancelClick()
    }
  }

  const handleAcceptClick = async () => {
    setTaskContent(refinedTask)
    setRefinedTask('')
    setIsModalOpen(false)
  }

  const handleCancelClick = () => {
    setRefinedTask('')
    setIsModalOpen(false)
  }

  return (
    <Modal
      open={isModalOpen}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          handleCancelClick();
        }
      }}
      aria-labelledby="ai-suggested-task-description"
      aria-describedby="ai-suggested-task-description-content"
      slotProps={{
        backdrop: {
          onClick: (e) => e.stopPropagation(),
          sx: {
            backgroundColor: 'transparent',
          },
        },
      }}
      sx={{
        overflow: 'auto',
        maxHeight: '70%',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: '-5%',
          transform: 'translate(-160%, 0)',
          width: '30%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          overflow: 'auto',
          maxHeight: '40%',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Grid container sx ={{backgroundColor: 'white', position:'sticky', top:0, zIndex: 1, borderBottom: '1px solid #e0e0e0'
        }}>
          <Grid item xs={7}>
        <Typography variant="h6" fontWeight={'light'} gutterBottom>
          AI-Suggested Task Description
        </Typography>
        </Grid>
        <Grid item xs={5}>
        <Box display="flex" justifyContent="flex-end" mb= {2}>
          <Button
            className="action-btn"
            variant="contained"
            color="error"
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <Button
            className="action-btn"
            variant="contained"
            color="primary"
            onClick={handleAcceptClick}
            disabled={loading}
            sx={{ ml: 2 }}
          >
            Accept
          </Button>
          
        </Box>
        </Grid>
        </Grid>
        <div
          ref={refinedTextAreaRef}
          style={{ color: 'black', whiteSpace: 'pre-wrap', marginTop: '16px', flexGrow: 1,  overflow: 'auto' }}
          dangerouslySetInnerHTML={{
            __html: loading
              ? 'Loading...'
              : highlightAddedContent(taskContent, refinedTask),
          }}
        />
      </Box>
    </Modal>
  );
  
  
}

export default FixTaskModal
