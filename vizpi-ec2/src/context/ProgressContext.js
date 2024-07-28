import React, { createContext, useContext, useEffect, useState } from 'react'
import { getConversationProgress, getPassrateProgress } from '../tool/progressUnit'
import { SelectedGroupContext } from './SelectedGroupContext'

export const ProgressContext = createContext()

export const ProgressContextProvider = ({ children }) => {
  const { selectedGroup } = useContext(SelectedGroupContext)
  const [progress, setProgress] = useState(null)

  useEffect(() => {
    if (selectedGroup && selectedGroup.messages) {
      setProgress({
        passrate: getPassrateProgress(selectedGroup.messages),
        conversation: getConversationProgress(selectedGroup.messages),
      })
    }
  }, [selectedGroup])

  return (
    <ProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </ProgressContext.Provider>
  )
}