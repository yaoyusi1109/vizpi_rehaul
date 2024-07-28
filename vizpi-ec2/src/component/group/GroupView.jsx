import React, { useContext, useEffect, useState } from 'react'
import { ProgressContext } from '../../context/ProgressContext'
import { SelectedGroupContext } from '../../context/SelectedGroupContext'
import {
  getPassrateProgress,
  getConversationProgress,
} from '../../tool/progressUnit'
import ProgressRings from './ProgressRings'
import { SessionContext } from '../../context/SessionContext'
import { getGroupPassrate } from '../../service/submissionService'
import { SubmissionsContext } from '../../context/SubmissionsContext'
import { GroupsContext } from '../../context/GroupsContext'
import { getCodeByUser } from '../../service/sessionService'
import { getUserInSession, getUsersByGroupId } from '../../service/userService'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import { IconButton, Tooltip } from '@mui/material'
import CommentIcon from '@mui/icons-material/Comment'
import { getGroupById } from '../../service/groupService'

const GroupView = ({ key, group }) => {
  const [users, setUsers] = useState([])
  const { groupsInSession } = useContext(GroupsContext)
  const { selectedGroup, setSelectedGroup } = useContext(SelectedGroupContext)
  const { selectedCode, setSelectedCode } = useContext(SelectedCodeContext)
  const { session } = useContext(SessionContext)
  const { submissions } = useContext(SubmissionsContext)
  const className = group?.id === selectedGroup?.id ? 'groupView selected' : 'groupView'
  const [passRate, setPassRate] = useState(getPassrateProgress(group.messages))
  const [conversationRate, setConversationRate] = useState(
    getConversationProgress(group.messages)
  )
  const [DM, setDM] = useState(null)

  const sortColor = (type) => {
    if (type === null) {
      return 'default'
    }
    if (type.read) {
      return 'primary'
    }
    return 'error'
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getUsersByGroupId(group.id)
      setUsers(usersData)
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    setPassRate(getGroupPassrate(submissions, group))
    setConversationRate(getConversationProgress(group.messages))
  }, [group, submissions])

  useEffect(() => {
    setConversationRate(getConversationProgress(group.messages))
  }, [groupsInSession])

  useEffect(() => {
    if (DM !== null && group === selectedGroup) {
      DM.read = true
    }
  }, [DM, selectedGroup])

  useEffect(() => {
    let aTime = null

    if (DM !== aTime) {
      if (aTime && aTime.read === null) {
        aTime.read = false
      }
      setDM(aTime)
    }
  }, [DM, group.messages])

  if (!users) {
    return <div>Loading...</div>
  }

  const handleClick = () => {
    getUserInSession(session.id, group.user_ids[0]).then((user) => {
      getCodeByUser(session.id, user).then((code) => {
        setSelectedCode(code)
      })
    })
    getGroupById(group.id).then((updatedGroup)=>{
      setSelectedGroup(updatedGroup)
    })
  }

  return (
    <div className={className} onClick={handleClick}>
      <IconButton
        className="icon"
        color={sortColor(DM)}
        onClick={() => handleClick}>
        <CommentIcon />
      </IconButton>
      <ProgressRings
        passrate={passRate}
        convorate={conversationRate}
        groupname={group?.name}
      />
    </div>
  )
}

export default GroupView
