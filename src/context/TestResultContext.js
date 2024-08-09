import React, {createContext, useState, useEffect} from "react";

export const TestResultContext = createContext();

export const TestResultContextProvider = ({children}) => {
    const [testResult, setTestResult] = useState([]);
    return (
        <TestResultContext.Provider value={{testResult, setTestResult}}>
            {children}
        </TestResultContext.Provider>
    )
    
}
