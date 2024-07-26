import React from "react";
import { createContext, useState, useContext, useEffect } from "react";

export const FunctionNameContext = createContext();

export const FunctionNameContextProvider = ({ children }) => {
    const [functionName, setFunctionName] = useState("solution");
    
    return (
        <FunctionNameContext.Provider value={{ functionName, setFunctionName }}>
        {children}
        </FunctionNameContext.Provider>
    )
};