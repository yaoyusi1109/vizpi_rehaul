import React, { createContext, useContext, useEffect, useState } from 'react'
import { SelectedUsersContext } from './SelectedUserContext'

export const SelectedCodeContext = createContext()

export const SelectedCodeProvider = ({ children }) => {
  const [selectedCode, setSelectedCode] = useState(null)
  const [rerender, setRerender] = useState(Date.now())
  const { selectedUsers } = useContext(SelectedUsersContext)

  // useEffect(() => {
  //   if (selectedUsers && selectedUsers[0]) {
  //     setSelectedCode(selectedUsers[0].code)
  //   }
  // }, [selectedUsers])

  return (
    <SelectedCodeContext.Provider value={{ selectedCode, setSelectedCode, rerender, setRerender }}>
      {children}
    </SelectedCodeContext.Provider>
  )
}