import React, { useContext, useState, useEffect } from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import { Button } from '@mui/material'
import { Typography } from '@mui/material'
import { SessionContext } from '../../context/SessionContext'
import { getCodeByUser } from '../../service/sessionService'
import { filterProfanity } from '../../tool/profanityFilter'
import { getUserInSession } from '../../service/userService'
import { getGroupById } from '../../service/groupService'
import { AuthContext } from '../../context/AuthContext'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'

const TestResultListItem = (index, user) => {
  const { session } = useContext(SessionContext)
  const { submissions } = useContext(SessionContext)
  const { currentUser } = useContext(AuthContext)
  const { setSelectedGroup } = useContext(SelectedCodeContext)
  const { selectedCode, setSelectedCode } = useContext(SelectedCodeContext)

  const handleDisplayCode = async (code) => {
    setSelectedCode(code)
    // setTimeout(() => {
    // }, 500)
  }

  const handleChangeGroup = async (currentGroup) => {
    await setSelectedGroup(currentGroup)
  }

  const handleInspectCode = async () => {
    const code = await getCodeByUser(user.id)
    code.content = filterProfanity(code.content)
    const codeUser = await getUserInSession(session.id, code.sender_id)

    const currentGroup = await getGroupById(codeUser.group_id)

    await handleChangeGroup(currentGroup)
    await handleDisplayCode(code)
  }
  return (
    <TableRow key={index} hover={'true'}>
      <TableCell>User {user}</TableCell>
      <TableCell>
        <Button variant="outlined">
          <Typography fontSize={10}>Inspect Code</Typography>
        </Button>
      </TableCell>
    </TableRow>
  )
}
export default TestResultListItem
