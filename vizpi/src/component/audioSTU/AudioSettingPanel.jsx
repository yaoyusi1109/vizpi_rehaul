import {
  Alert,
  Button,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material'
import { SessionContext } from '../../context/SessionContext'
import { useContext } from 'react'
import { showToast } from '../commonUnit/Toast'
import {
  generateUserInSession,
  groupingInSession,
  removeGroupingInSession,
  setSessionEnableChat,
} from '../../service/sessionService'
import { useState } from 'react'
import { useEffect } from 'react'
import { generateMulMsg, removeMsgInCurrentSession } from '../../tool/demoUnits'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import '../../css/setting.scss'
import PeerInstruction from '../student-components/PeerInstruction'
import GroupingModal from '../topBar/GroupingModal'

const AudioSettingPanel = () => {
  const { session } = useContext(SessionContext)
  const [chatEnable, setChatEnable] = useState(false)
  const [show, setShow] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  useEffect(() => {
    setChatEnable(session?.enable_chat)
  }, [session])

  // const handleTestEnableChange = () => {
  //   setTestEnable(!testEnable)
  // }

  const handleChatEnableChange = async () => {
    if (!session?.grouped && !chatEnable) {
      showToast('Please group students first.', 'error')
      return
    }
    try {
      await setSessionEnableChat(session?.id, !chatEnable)
    } catch (error) {
      console.error('Error changing chat enable status: ', error)
    }
  }

  const handleNext = async () => {
    if (!session?.stu_num || session?.stu_num <= 2) {
      showToast('Please wait for more students', 'warning')
      return
    }
    await groupingInSession(session, 'passrate').then((res) => {
      if (res) {
        showToast('Grouping successfully.', 'success')
        setChatEnable(true)
      } else {
        showToast('Grouping failed.', 'error')
        return
      }
    })

    await setSessionEnableChat(session?.id, !chatEnable)
  }

  const handleReplay = () => {
    generateMulMsg(session.id, 5)
  }

  const handleRemoveMsg = () => {
    removeMsgInCurrentSession(session.id)
  }

  const handleAddStu = () => {
    generateUserInSession(session.id)
  }

  const handleRemoveGroup = async () => {
    try {
      const res = await removeGroupingInSession(session)
      if (res) {
        showToast('Remove Group successfully.', 'success')
        setChatEnable(false)
      } else {
        showToast('Remove Group failed.', 'error')
      }
    } catch (error) {
      showToast('An error occurred while removing the group.', 'error')
      console.error('Error removing group:', error)
    }
  }

  if (!session) return <Alert severity="error">Session not found</Alert>

  return (
    <div className="setting-panel">
      <PeerInstruction />
      {session?.grouped && (
        <FormControlLabel
          value="top"
          label="Chat"
          labelPlacement="start"
          control={
            <Switch
              className="switch"
              checked={chatEnable}
              onChange={handleChatEnableChange}
              color="primary"
            />
          }
        />
      )}
      {!session.grouped && (
        <>
          <Button onClick={handleModalOpen} variant="outlined">
            Grouping
          </Button>
          <Modal
            open={modalOpen}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
              <GroupingModal show={show} setShow={setShow} />
            </Box>
          </Modal>
        </>
      )}
      <Typography>Active Students: {session.stu_num}</Typography>

      {/* <FormControlLabel
        value="top"
        label="Test Mode"
        labelPlacement="start"
        control={
          <Switch
            checked={testEnable}
            onChange={handleTestEnableChange}
            color="primary"
          />
        }
      /> */}
      {/* {testEnable && (
        <>
          <Button
            variant="contained"
            color="secondary"
            className="action-btn"
            onClick={handleAddStu}>
            Add students
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="action-btn"
            onClick={handleReplay}>
            Replay
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="action-btn"
            onClick={handleRemoveGroup}>
            RemoveGroup
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="action-btn"
            onClick={handleRemoveMsg}>
            Remove Messages
          </Button>
        </>
      )} */}
    </div>
  )
}

export default AudioSettingPanel
