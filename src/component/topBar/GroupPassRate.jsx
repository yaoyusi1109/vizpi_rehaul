import React, { useContext, useEffect } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import UserView from './UserView'
import { SelectedGroupContext } from '../../context/SelectedGroupContext'
import { SelectedUsersContext } from '../../context/SelectedUserContext'
import { SubmissionsContext } from '../../context/SubmissionsContext'
import { getGroupPassrate } from '../../service/submissionService'
import { useState } from 'react'
import '../../css/group-passrate.scss'
import { AuthContext } from '../../context/AuthContext'

const GroupPassRate = ({}) => {
  const { selectedUsers } = useContext(SelectedUsersContext)
  const { selectedGroup } = useContext(SelectedGroupContext)
  const { submissions } = useContext(SubmissionsContext)
  const [passrate, setPassrate] = useState(0)
  const { currentUser } = useContext(AuthContext)
  useEffect(() => {
    if (selectedGroup) {
      setPassrate(getGroupPassrate(submissions, selectedGroup))
    }
  }, [selectedGroup, submissions])

  return (
    <div className="group-passrate">
      {/* <h3 className="header">Pass Rate</h3> */}

      {currentUser.role <= 2 ? (
        <div className="group-info-test-content">
          <h3 className="header">
            {selectedGroup ? selectedGroup.name : 'No group is focused'}
          </h3>
          <CircularProgressbar
            className="pass_rate"
            value={passrate}
            text={passrate + '%'}
            background
            backgroundPadding={6}
            styles={buildStyles({
              backgroundColor: '#B2FFB2',
              textColor: '#000',
              pathColor: `rgba(62, 152, 199, 75)`,
              trailColor: 'transparent',
              textSize: '20px',
              fontWeight: '1000',
            })}
          />
        </div>
      ) : null}
      <div className="user-view-container">
        {selectedUsers?.map((user, index) => (
          <UserView user={user} key={index} />
        ))}
      </div>
    </div>
  )
}

export default GroupPassRate
