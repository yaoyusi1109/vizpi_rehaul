import { useContext, useEffect } from 'react'
import { useState } from 'react'
import ProgressBar from './ProgressBar'
import { getAvatar } from '../../tool/Tools'
import { getSubmissionInContextById } from '../../service/submissionService'
import { SelectedGroupContext } from '../../context/SelectedGroupContext'
import { SubmissionsContext } from '../../context/SubmissionsContext'
import { getParticipationByUserId } from '../../service/groupService'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import { SelectedUsersContext } from '../../context/SelectedUserContext'
import { AuthContext } from '../../context/AuthContext'
import { getCodeByUser } from '../../service/sessionService'
import {getCodeById} from '../../service/codeService'
import {getUserById} from '../../service/userService'
import TerminalIcon from '@mui/icons-material/Terminal';

const UserView = ({ user }) => {
  const { selectedGroup,setSelectedGroup } = useContext(SelectedGroupContext)
  const { submissions } = useContext(SubmissionsContext)
  const [passrate, setPassrate] = useState(0)
  const [conversationRate, setConversationRate] = useState(0)
  const { selectedUsers } = useContext(SelectedUsersContext)
  const { selectedCode, setSelectedCode } = useContext(SelectedCodeContext)
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    const submission = getSubmissionInContextById(submissions, user.id)
    setPassrate(submission ? submission.passrate : 0)
    setConversationRate(
      getParticipationByUserId(selectedGroup.messages, user.id)
    )
  }, [user, submissions])

  if (
    !selectedUsers ||
    selectedUsers.length === 0 ||
    selectedUsers[0] === null
  ) {
    return null
  }

  const handleImageClick = async (user) => {
    let updatedSelf = await getUserById(currentUser.id)
    let selfCode =await getCodeById(updatedSelf.code_id)
    if(currentUser.role < 3 || selfCode?.passrate===100){
      // //console.log("clicked icon", user, user?.code_id)
      let updatedUser = await getUserById(user.id)
      const code = await getCodeById(updatedUser?.code_id)
       //console.log("clicked icon", user,code, user?.code_id)
      setSelectedCode(code)
    }
    
  }
  if(user.role<3){
    return null
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="userView" style={{border: user.id === currentUser.id ?'1px solid rgba(0, 0, 0, 0.5)' : '1px solid rgba(0, 0, 0, 0.0)'}}>
      <div className="userViewHeader" onClick={() => handleImageClick(user)}>
        <img
          src={getAvatar(user?.avatar_url)}
          alt={`${user?.first_name}'s avatar`}
          className={selectedCode?.creater_id === user.id ? 'selected' : ''}
        />
        <span className="userName">{user.id===currentUser.id?"(You) ":""}{user?.first_name}</span>
      </div>
      <div className="progressContainer">
        <ProgressBar name="Passrate" rate={passrate} />
        {currentUser.role <= 2 ? (
          <ProgressBar name="Conversation" rate={conversationRate} />
        ) : null}
      </div>
      {selectedCode?.creater_id === user.id ?<TerminalIcon/>:null}
    </div>
  )
}

export default UserView
