import Messages from './Messages'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { SelectedGroupContext } from '../../context/SelectedGroupContext'
import { AuthContext } from '../../context/AuthContext'
import {
  getGroupByUser,
  getGroupsByUser,
  removeUserFromGroup,
  subscribeToGroupMessage,
} from '../../service/groupService'
import { getUsersByGroupId } from '../../service/userService'
import { MenuItem, Select, IconButton, Tooltip } from '@mui/material'
import { green, grey } from '@mui/material/colors'
import {
  sendMessageToAllGroup,
  sendMessageToGroup,
} from '../../service/chatService'
import { SessionContext } from '../../context/SessionContext'
import { showToast } from '../commonUnit/Toast'
import { filterProfanity } from '../../tool/profanityFilter'
import { MessageContext } from '../../context/MessageContext'
import '../../css/audio/audioChat.scss'
import { ExitToApp, Mic, Stop } from '@mui/icons-material'
import { closeDeepgram, setupDeepgram } from '../../service/DeepgramService'

const AudioChat = () => {
  const [displayedMessages, setDisplayedMessages] = useState([])
  const { chatMessage, setChatMessage } = useContext(MessageContext)

  const { selectedGroup, setSelectedGroup, waiting, setWaiting } =
    useContext(SelectedGroupContext)
  const { currentUser } = useContext(AuthContext)
  const { session } = useContext(SessionContext)
  const [receiver, setReceiver] = useState('group')
  const [users, setUsers] = useState([])
  const [keystrokes, setKeystrokes] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const chatHistoryRef = useRef(null)
  const [showPopup, setShowPopup] = useState(true)

  useEffect(() => {
    if (!session.enable_chat) {
      setIsListening(false)
      closeDeepgram()
    }
  }, [session])

  useEffect(() => {
    const fetchGroup = async () => {
      if (!selectedGroup && currentUser && session.grouped) {
        if (currentUser.role === 3) {
          const group = await getGroupByUser(currentUser.id, session.id)
          console.log('group', group)
          setSelectedGroup(group)
        }
      }
    }
    fetchGroup()
  }, [currentUser, selectedGroup, session.grouped])

  useEffect(() => {
    // console.log(session)
    if (!session.grouped) {
      setSelectedGroup(null)
    }
    let me = session?.identity_list?.find(
      (element) => element.id === currentUser.id
    )
    if (me === undefined && waiting) {
      setWaiting(false)
    } else if (me != null && !waiting) {
      setWaiting(true)
    }
  }, [session])

  useEffect(() => {
    let speakingInterval
    if (isListening) {
      speakingInterval = setInterval(() => {
        setIsSpeaking((prev) => !prev)
      }, 1000)
    } else {
      clearInterval(speakingInterval)
      setIsSpeaking(false)
    }
    return () => clearInterval(speakingInterval)
  }, [isListening])

  useEffect(() => {
    if (!selectedGroup) {
      return
    }
    setUsers([])

    if (!selectedGroup.user_ids) {
      return
    }
    const fetchUsers = async () => {
      getUsersByGroupId(selectedGroup.id)
        .then((users) => {
          setUsers(users)
        })
        .catch((err) => {
          console.error(err)
        })
    }
    fetchUsers()

    const unsubscribe = subscribeToGroupMessage(
      currentUser.role === 3 ? currentUser.id : -1,
      selectedGroup.id,
      setDisplayedMessages
    )
    // console.log('subscribed to group', selectedGroup.id)
    return () => {
      unsubscribe()
    }
  }, [selectedGroup])

  useEffect(() => {
    // console.log('displayedMessages', displayedMessages)
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight
    }
  }, [displayedMessages])

  const handleRecording = async () => {
    if (!isListening && session.enable_chat) {
      setupDeepgram((message) =>
        sendMessageToGroup(
          filterProfanity(message),
          currentUser,
          selectedGroup.id,
          keystrokes
        )
      )
      setIsListening(true)
    } else {
      closeDeepgram()
      setIsListening(false)
    }
  }

  const handleUserChange = (e) => {
    setReceiver(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(e)
    }
  }

  const sendMessage = async (e) => {
    if (e != undefined) {
      e.preventDefault()
    }
    if (session?.group_round == 2 && selectedGroup?.group_round !== 2) {
      return
    }

    if (session.enable_chat) {
      let sentMessage
      if (receiver !== 'class') {
        sentMessage = await sendMessageToGroup(
          filterProfanity(chatMessage),
          currentUser,
          selectedGroup.id,
          keystrokes
        )
      } else {
        sentMessage = await sendMessageToAllGroup(
          filterProfanity(chatMessage),
          currentUser,
          keystrokes
        )
      }
      setKeystrokes([])
      if (sentMessage !== undefined) {
        setChatMessage('')
      }
    } else {
      showToast('Chat is disabled', 'warning')
    }
  }

  const handleAcceptRecording = () => {
    setShowPopup(false)
    handleRecording()
  }

  const handleRemoveUserFromGroup = async () => {
    if (selectedGroup) {
      await removeUserFromGroup(selectedGroup.id, currentUser.id)
      setSelectedGroup(null)
    }
  }

  if (!selectedGroup) {
    if (currentUser.role === 3) {
      if (session.type === 'Helper/Helpee') {
        return (
          <div className="chat">
            Use the 'Ask for Help' or 'Offer Help to Others' button to help and
            chat with other students
          </div>
        )
      }
    }
  }

  return (
    <>
      <div className="chat">
        <div className="audio-list"></div>
        <div className="group-name">
          {selectedGroup ? selectedGroup.name : 'No Group Selected'}

          <Tooltip title="Exit current group">
            <IconButton
              color="primary"
              onClick={handleRemoveUserFromGroup}
              className="leave-group-button">
              <ExitToApp />
            </IconButton>
          </Tooltip>
        </div>
        <div className="chat-history" ref={chatHistoryRef}>
          <Messages messages={displayedMessages} />
        </div>
        <form className="message-form" onSubmit={sendMessage}>
          <IconButton
            onClick={handleRecording}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: `6px solid ${
                isListening
                  ? isSpeaking
                    ? green[500]
                    : grey[500]
                  : 'transparent'
              }`,
              transition: 'border-color 0.3s ease',
              padding: 0,
            }}
            color="primary">
            {isListening ? <Stop /> : <Mic />}
          </IconButton>
          <textarea
            className="message-input"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder={
              session.enable_chat
                ? 'Use Shift + Enter for new line'
                : 'Chat is disabled'
            }
            onKeyDown={handleKeyPress}
          />
          <button type="submit" className="send-button">
            Send
          </button>
          {/* <Select
            value={receiver}
            onChange={handleUserChange}
            className="user-select">
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.first_name}
              </MenuItem>
            ))}
            {currentUser.role === 3 && (
              <MenuItem key={'instructor'} value={'instructor'}>
                Instructor & TA
              </MenuItem>
            )}
            <MenuItem key={'group'} value={'group'}>
              Group
            </MenuItem>
            {currentUser.role < 3 && (
              <MenuItem key={'class'} value={'class'}>
                Class
              </MenuItem>
            )}
          </Select> */}
        </form>
      </div>

      {showPopup && (
        <div className="popup-window">
          <div className="popup-content">
            <h2>Permission Request</h2>
            <p>
              This application will analyze audio using AI tools. Do you accept?
            </p>
            <button onClick={handleAcceptRecording}>Accept</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AudioChat
