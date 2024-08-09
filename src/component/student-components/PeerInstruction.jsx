import React, { useState, useContext, useEffect } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { AuthContext } from '../../context/AuthContext'
import { CurrentStepContext } from '../../context/CurrentStepContext'
import { SessionContext } from '../../context/SessionContext'
const PeerInstruction = () => {
  const steps = ['Individual Attempt', 'Group Attempt']
  const { currentUser } = useContext(AuthContext)
  const { activeStep, setActiveStep } = useContext(CurrentStepContext)
  const [skipped, setSkipped] = React.useState(new Set())
  const { session } = useContext(SessionContext)

  useEffect(() => {
    if (session?.grouped) {
      setActiveStep(1)
    }
  }, [session])

  const isStepSkipped = (step) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  return (
    <Box sx={{ width: '100%', py: 1 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {}
          const labelProps = {}

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
    </Box>
  )
}

export default PeerInstruction
