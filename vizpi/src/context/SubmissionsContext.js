import React, { createContext, useState, useContext, useEffect } from 'react'
import { subscribeSubmissions } from '../service/submissionService'
import { AuthContext } from './AuthContext'

export const SubmissionsContext = createContext()

export const SubmissionsProvider = ({ children }) => {
  const [submissions, setSubmissions] = useState([])
  const { currentUser } = useContext(AuthContext)


  useEffect(() => {
    let unsubscribe = subscribeSubmissions(currentUser.session_id, setSubmissions)
    return () => unsubscribe()
  }, [currentUser])


  return (
    <SubmissionsContext.Provider value={{ submissions, setSubmissions }}>
      {children}
    </SubmissionsContext.Provider>
  )
}
