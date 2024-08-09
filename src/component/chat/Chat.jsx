import Messages from './Messages'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { SelectedGroupContext } from '../../context/SelectedGroupContext'
import { AuthContext } from '../../context/AuthContext'
import {
  getGroupByUser,
  getGroupsByUser,
  subscribeToGroupMessage,
} from '../../service/groupService'
import { getUsersByGroupId } from '../../service/userService'
import { getSubmissionsBySessionId } from '../../service/submissionService'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Fab,
  Button,
  Tab,
  Tabs,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import ReplyIcon from '@mui/icons-material/Reply'
import NavigationIcon from '@mui/icons-material/Navigation'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import { extractErrorInfo } from '../../service/errorService'
import {
  sendMessageToAllGroup,
  sendMessageToGroup,
} from '../../service/chatService'
import { SessionContext } from '../../context/SessionContext'
import { showToast } from '../commonUnit/Toast'
import { getUserInSession } from '../../service/userService'
import { filterProfanity } from '../../tool/profanityFilter'
import { MessageContext } from '../../context/MessageContext'
import '../../css/chat.scss'
import { GroupsContext } from '../../context/GroupsContext'

const Chat = () => {
  const [displayedMessages, setDisplayedMessages] = useState([])
  const { chatMessage, setChatMessage } = useContext(MessageContext)

  const { selectedGroup, setSelectedGroup, waiting, setWaiting } =
    useContext(SelectedGroupContext)
  const { selectedCode, setSelectedCode } = useContext(SelectedCodeContext)
  const { currentUser } = useContext(AuthContext)
  const { session } = useContext(SessionContext)
  const [usersGroups, setUsersGroups] = useState([])
  const [groupRound, setGroupRound] = useState(0)
  const [userNum, setUserNum] = useState(0)
  const [questionList, setQuestionList] = useState([])
  const [receiver, setReceiver] = useState('group')
  const [users, setUsers] = useState([])
  const [keystrokes, setKeystrokes] = useState([])
  const [unsubscribe, setUnsubscribe] = useState()
  const chatHistoryRef = useRef(null)

  useEffect(() => {
    if (session?.group_round != groupRound) {
      setGroupRound(session?.group_round)
      fetchGroups()
    }
  }, [session])

  useEffect(() => {
    if (selectedCode == null) {
      setQuestionList(['How do I start?', 'Can you explain the task?'])
    } else if (selectedCode?.passrate === 100) {
      setQuestionList(['Would anyone like some help?'])
    } else {
      getSubmissionsBySessionId(session.id).then((submissions) => {
        const submission = submissions?.find(
          (element) => element.code_id === selectedCode?.id
        )
        let questions = ['How did you complete the task?']
        if (submission?.error != null) {
          let textError = extractErrorInfo(submission.error)
          questions.push(
            'Why am I getting a ' + textError.actualError + ' error?'
          )
        }
        submission?.result_list?.forEach((result, index) => {
          if (!result) {
            questions.push(
              'How to pass the ' + session.test_list[index].testName + ' test?'
            )
          }
        })
        setQuestionList(questions)
      })
    }
  }, [selectedCode])

  useEffect(() => {
    const fetchGroup = async () => {
      if (!selectedGroup && currentUser && session.grouped) {
        if (currentUser.role === 3) {
          const group = await getGroupByUser(currentUser.id,session.id)
          // //console.log('group', group)
          setSelectedGroup(group)
        }
      }
    }
    fetchGroup()
  }, [currentUser, selectedGroup, session.grouped])

  useEffect(() => {
    // //console.log(session)
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

  const fetchGroups = async () => {
    if(currentUser.role<3) return
    let groups = await getGroupsByUser(currentUser.id,session.id)
    console.log(groups)
    if(groups && usersGroups?.length!=groups?.length){
      showToast("Entered Group","success")
      setSelectedGroup(groups[groups?.length-1])
    }
    setUsersGroups(groups)
  }

  useEffect(() => {
    if (waiting) {
      //console.log("Start waiting")
    } else {
      //console.log("entered group")
      fetchGroups()
    }
  }, [waiting])

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
      setDisplayedMessages,
      setSelectedGroup
    )
    //console.log('subscribed to group', selectedGroup.id)
    return () => {
      unsubscribe()
    }
  }, [selectedGroup])

  useEffect(() => {
    //console.log('displayedMessages', displayedMessages)
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight
    }
  }, [displayedMessages])

  if (!session) return null

  const handleUserChange = (e) => {
    setReceiver(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(e)
    }
  }

  const sendMessageManual = async (message) => {
    if (session.enable_chat) {
      if (session?.group_round == 2 && selectedGroup?.group_round == 1) {
        return
      }

      let sentMessage
      if (receiver !== 'class') {
        sentMessage = await sendMessageToGroup(
          filterProfanity(message),
          currentUser,
          selectedGroup.id,
          null
        )
      } else {
        sentMessage = await sendMessageToAllGroup(
          filterProfanity(message),
          currentUser,
          null
        )
      }
    } else {
      showToast('Chat is disabled', 'warning')
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
  const handleUserClick = async (event, userNumber) => {
    setUserNum(userNumber)
    setSelectedGroup(usersGroups[userNumber])
  }
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  if (!selectedGroup) {
    if (currentUser.role === 3) {
      if (session.type === 'Helper/Helpee' || session.type.startsWith("SQL")) {
        return (
          <div className="chat">
            Use the 'Ask for Help' or 'Offer Help to Others' button to help and
            chat with other students
          </div>
        )
      } else if (!session.enable_chat)
        return (
          <div className="chat">
            The current grouping session has concluded. You'll be assigned to a
            group in the next session. Please hang tight, and thank you for your
            patience!
          </div>
        )
    }
  }

  return (
    <div className="chat">
      {currentUser.role === 3 && (
        <Tabs
          value={userNum}
          onChange={handleUserClick}
          variant="fullWidth"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable basic tabs example">
          {usersGroups?.map((group, index) => (
            <Tab
              label={group.name}
              sx={{
                bgcolor: index === userNum ? '#C0C0C0' : '#DCDCDC',
                borderRadius: 1,
                border: index === userNum ? 1 : 0,
                borderColor:
                  index === userNum
                    ? 'primary.main'
                    : 'hsla(120, 100%, 50%, 0.3)',
              }}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      )}
      {/* {currentUser.role < 3 ? <ControlBar onPlay={handlePlay} /> : null} */}
      <div className="chat-history" ref={chatHistoryRef}>
        <Messages messages={displayedMessages} />
      </div>
      {currentUser.role === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {questionList.map((question) => (
            <Button
              color="primary"
              variant="contained"
              size="small"
              sx={{ alignSelf: 'flex-end', mb: '2px', borderRadius: 28 }}
              onClick={() => {
                sendMessageManual(question)
              }}
              endIcon={<NavigationIcon />}>
              {question}
            </Button>
          ))}
        </div>
      )}

      <form className="message-form" onSubmit={sendMessage}>
        <textarea
          className="message-input"
          value={chatMessage}
          onChange={(e) => {
            let length = e.target.value.length - chatMessage.length
            if (length > 0) {
              let history = {
                location: e.target.selectionStart - length,
                insert: true,
                value: e.target.value.substring(
                  e.target.selectionStart - length,
                  e.target.selectionStart
                ),
                length: length,
                time: new Date(),
              }
              keystrokes.push(history)
              console.log(history)
              ////console.log("insert: ",e.target.value.substring(e.target.selectionStart-length,e.target.selectionStart))
            } else if (length < 0) {
              let history = {
                location: e.target.selectionStart,
                insert: false,
                value: null,
                length: -1 * length,
                time: new Date(),
              }
              keystrokes.push(history)
              console.log(history)
              ////console.log("delete: ",messageContent.substring(e.target.selectionStart,e.target.selectionStart-length))
            }
            setChatMessage(e.target.value)
          }}
          placeholder={
            session.enable_chat
              ? 'Use Shift + Enter for new line'
              : 'Chat is disabled'
          }
          onKeyDown={handleKeyPress}
        />

        <button type="submit" className="send-button">
          Send to
        </button>
        <Select value={receiver} onChange={handleUserChange}>
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
        </Select>
      </form>
    </div>
  )
}

export default Chat
