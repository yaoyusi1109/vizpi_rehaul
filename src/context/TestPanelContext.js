import React, {createContext, useState} from "react";

export const TestPanelContext = createContext();

export const TestPanelContextProvider = ({children}) => {
    const [testPanel, setTestPanel] = useState(true);
    const [testName, setTestName] = useState("");
    const [studPassArray, setStudPassArray] = useState([]);
    const [studIndex, setStudIndex] = useState(0);
    const [testIndex, setTestIndex] = useState(0);
    const [studName, setStudName] = useState("");
    const [testlength, setTestLength] = useState(0);
    return (
        <TestPanelContext.Provider value={{testPanel, testIndex, testlength, setTestLength,testName, studPassArray, studIndex, studName, setStudName, setStudIndex, setTestName, setTestPanel, setStudPassArray, setTestIndex}}>
            {children}
        </TestPanelContext.Provider>
    )
}