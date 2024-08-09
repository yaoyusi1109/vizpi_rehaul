import React, { createContext, useState, useContext, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { getSessionById, subscribeSession } from '../service/sessionService'

export const SessionContext = createContext()

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [link, setLink] = useState("")
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    if (currentUser && currentUser.session_id) {
      getSessionById(currentUser.session_id).then((session) => {
        if (session === null) return
        setSession(session)
        setSessionLoading(false)
      }).catch((err) => {
        console.error(err)
      })
      return subscribeSession(currentUser.session_id, setSession)
    } else if (currentUser && !currentUser.session_id) {
      setSessionLoading(true)
    }
  }, [currentUser])


  return (
    <SessionContext.Provider value={{ session, setSession, sessionLoading, link, setLink }}>
      {children}
    </SessionContext.Provider>
  )
}


