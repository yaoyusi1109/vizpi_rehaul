import React , { createContext, useState, useContext, useEffect } from 'react'

export const ErrorContext = createContext()

export const ErrorContextProvider = ({ children }) => {
    const [error, setError] = useState("Adding print statements to code might result in multiple outputs based on the number of unit tests")
    
    return (
        <ErrorContext.Provider value={{ error, setError }}>
        {children}
        </ErrorContext.Provider>
    )
}