import React, { useState, createContext } from 'react';

export const CurrentStepContext = createContext();

export const CurrentStepContextProvider = (props) => {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <CurrentStepContext.Provider value={{ activeStep, setActiveStep }}>
            {props.children}
        </CurrentStepContext.Provider>
    );
};

