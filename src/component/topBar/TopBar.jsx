import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import ClassInfo from './ClassInfo'
import TaskCard from './TaskCard'
import UserProfile from './UserProfile'
import UnitTest from './UnitTest'
import { SubmissionsProvider } from '../../context/SubmissionsContext'

const TopBar = () => {
  const [selectedBar, setSelectedBar] = useState('')
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    if (
      !currentUser ||
      !currentUser.session_id ||
      currentUser.session_id === ''
    ) {
      return
    }

    if (!selectedBar && currentUser.role < 3) {
      setSelectedBar('Unit Test')
    } else if (!selectedBar && currentUser.role == 3) {
      setSelectedBar('Task')
    }
  }, [currentUser])

  const BarComponent = () => {
    switch (selectedBar) {
      case 'Task':
        return <TaskCard />
      case 'Class Info':
        return (
          <SubmissionsProvider>
            <ClassInfo />
          </SubmissionsProvider>
        )
      case 'Unit Test':
        return <UnitTest />
      default:
        if (currentUser.role < 3) {
          return <UnitTest />
        } else return <TaskCard />
    }
  }

  const handleItemClick = (item) => {
    setSelectedBar(item)
  }

  return (
    <div className="top-bar">
      <div className="tittle-bar">
        {currentUser.session_id && currentUser.session_id !== '' ? (
          <div className="bar-type">
            {currentUser?.role == 3 && (
              <span
                className={selectedBar === 'Task' ? 'selected' : ''}
                onClick={() => handleItemClick('Task')}>
                Task
              </span>
            )}

            {currentUser?.role <= 2 && (
              <>
                <span
                  className={selectedBar === 'Class Info' ? 'selected' : ''}
                  onClick={() => handleItemClick('Class Info')}>
                  Class Info
                </span>

                <span>|</span>
                <span
                  className={selectedBar === 'Unit Test' ? 'selected' : ''}
                  onClick={() => handleItemClick('Unit Test')}>
                  Test
                </span>
              </>
            )}
          </div>
        ) : null}
        <UserProfile />
      </div>

      <div className="bar">
        <BarComponent />
      </div>
    </div>
  )
}

export default TopBar
