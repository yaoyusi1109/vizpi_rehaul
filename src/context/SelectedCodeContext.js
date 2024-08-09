import React, { createContext, useContext, useEffect, useState } from 'react'
import { SelectedUsersContext } from './SelectedUserContext'

export const SelectedCodeContext = createContext()

export const SelectedCodeProvider = ({ children }) => {
  const [selectedCode, setSelectedCode] = useState(null)
  const [rerender, setRerender] = useState({date: Date.now(), width:{left:500,middle:window.innerWidth-1000,right:500}})
  const [keystrokes, setKeystrokes] = useState([])
  const [latestCodeId, setLatestCodeId] = useState('')
  const [output, setOutput] = useState('')
  const { selectedUsers } = useContext(SelectedUsersContext)

  // useEffect(() => {
  //   if (selectedUsers && selectedUsers[0]) {
  //     setSelectedCode(selectedUsers[0].code)
  //   }
  // }, [selectedUsers])

  return (
    <SelectedCodeContext.Provider value={{ selectedCode, setSelectedCode, rerender, setRerender, keystrokes, setKeystrokes, latestCodeId, setLatestCodeId,output, setOutput  }}>
      {children}
    </SelectedCodeContext.Provider>
  )
}