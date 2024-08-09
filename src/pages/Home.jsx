import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import Session from './Session'
import { SelectedTestProvider } from '../context/SelectedTest'
import { ModeContext } from '../context/ModeContext'
import Loading from '../component/commonUnit/Loading'
import { getSessionById } from '../service/sessionService'
import { useState } from 'react'
import { useResizable } from 'react-resizable-layout'
import '../css/codeIssuePanel.scss'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { validateToken } from '../service/authService'
import { GroupsProvider } from '../context/GroupsContext'
import { GroupsFilterProvider } from '../context/GroupsFilterContext'
import { ErrorContextProvider } from '../context/ErrorContext'
import { TestResultContextProvider } from '../context/TestResultContext'
import { AutoGroupingContextProvider } from '../context/AutoGroupingContext'
import { PresenterListProvider } from '../context/PresenterListContext'
import { CurrentStepContextProvider } from '../context/CurrentStepContext'
import { MessageProvider } from '../context/MessageContext'
import { SubmissionsProvider } from '../context/SubmissionsContext'
import HeaderBanner from '../component/topBar/HeaderBanner'
import BasicTabs from '../component/commonUnit/TabPanels'
import StudentPanel from '../component/student-components/StudentPanel'
import AudioStu from '../component/audioSTU/AudioStu'
import AudioSessionPanel from '../component/audioSTU/AudioSessionPanel'
import { addStu, addStuToSession, getStuById } from '../service/studentService'

const Home = React.memo(() => {
  const { currentUser, setCurrentUser } = useContext(AuthContext)
  const { Mode } = useContext(ModeContext)
  const [session, setSession] = useState(null)
  const navigate = useNavigate()
  const {
    isDragging: isCodeIssueDragging,
    position: codeIsueW,
    separatorProps: codeIssueSeparatorProps,
  } = useResizable({
    axis: 'x',
    initial: 600,
    min: 0,
  })

  useEffect(() => {
    if (!currentUser) {
      //console.log('User not found!')
      return
    }

    const fetchSession = async () => {
      getSessionById(currentUser.session_id).then((session) => {
        console.log(session)
        setSession(session)
      })
    }
    fetchSession()
  }, [currentUser])

  useEffect(() => {
    console.log(currentUser)
    if (currentUser !== null) return
    if (Cookies.get('VizPI_token')) {
      const token = Cookies.get('VizPI_token')
      console.log(token)
      validateToken(token)
        .then((user) => {
          if (user) {
            setCurrentUser(user)
          }
        })
        .catch((err) => {
          console.error(err)
          navigate('/about')
        })
    } else {
      
      let userId = Cookies.get('VisPI_userId')
      console.log(userId)
      if (userId){
        getStuById(userId).then(async (res) => {
          console.log(res)
          if (res) {
            setCurrentUser(res)
          }
        })
      }
      else{
        navigate('/about')
      }
    }
  }, [])

  if (!currentUser) {
    return <Loading />
  }

  if (currentUser.session_id === null || currentUser.session_id === '') {
    return <Session />
  }

  if (!session) {
    return <Session />
  }

  return (
    <div className="home">
      <SelectedTestProvider>
        <GroupsProvider sessionId={session?.id}>
          <GroupsFilterProvider>
            <ErrorContextProvider>
              <TestResultContextProvider>
                <AutoGroupingContextProvider>
                <HeaderBanner />
                  <PresenterListProvider>
                    <CurrentStepContextProvider>
                      <MessageProvider sessionId={session?.id}>
                        <div className="container">
                          {currentUser?.role <= 2 &&
                            session?.type === 'Audio' && <AudioSessionPanel />}
                          {currentUser?.role <= 2 &&
                            session?.type !== 'Audio' && (
                              <>
                                <SubmissionsProvider>
                                  <BasicTabs />
                                </SubmissionsProvider>
                              </>
                            )}

                          {currentUser.role === 3 &&
                            session?.type === 'Audio' && <AudioStu />}
                          {currentUser.role === 3 &&
                            session?.type !== 'Audio' && <StudentPanel />}
                        </div>
                      </MessageProvider>
                    </CurrentStepContextProvider>
                  </PresenterListProvider>
                </AutoGroupingContextProvider>
              </TestResultContextProvider>
            </ErrorContextProvider>
          </GroupsFilterProvider>
        </GroupsProvider>
      </SelectedTestProvider>
    </div>
  )
})

export default Home
