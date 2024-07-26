import '@fontsource/inter'
import Modal from '@mui/joy/Modal'
import { useState, React } from 'react'
import { Button } from '@mui/material'
import Typography from '@mui/joy/Typography'
import Sheet from '@mui/joy/Sheet'
import ModalClose from '@mui/joy/ModalClose'
import sessionList from '../../icon/sessionList.png'
import layout from '../../icon/Layout.png'
import taskEditing from '../../icon/taskedit.png'
import autoGroup from '../../icon/SettingPassRate.png'
import manualGroup from '../../icon/manualGrouping.png'
import unitTest from '../../icon/Group 36.png'
import createUnitTest from '../../icon/unitTestAdd.png'
import codeIssues from '../../icon/CodeIssues.png'
import performance from '../../icon/passrate.png'
import grouping from '../../icon/Grouping.png'
import chatting from '../../icon/Message.png'
import codeView from '../../icon/CodeViewing.png'
import ModalOverflow from '@mui/joy/ModalOverflow'
import ModalDialog from '@mui/joy/ModalDialog'
import Divider from '@mui/joy/Divider'
import Chip from '@mui/joy/Chip'

const TutorialModal = () => {
  const [open, setOpen] = useState(false)
  const [contentIndex, setContentIndex] = useState(0)

  const contentArray = [
    {
      src: layout,
      title: 'Welcome to VizPI',
      content:
        'VizPI is an interface that allows instructors to facilitate in-class peer programming sessions. This tutorial will help you navigate the interface with its important features.',
    },
    {
      src: sessionList,
      title: 'Session List',
      content:
        'This is the session list. You can create a new session by clicking the "Create Session" button. You can also join a session by clicking the "Join Session" button and entering the session code.',
    },
    {
      src: taskEditing,
      title: 'Task Editing',
      content:
        'Once Logged In , You can still edit the task using the edit button.',
    },
    {
      src: autoGroup,
      title: 'Automatic Grouping',
      content:
        'You can specify when to initiate student grouping based on pass rate. This means that when a certain percent of students passed all the unit tests, VizPI will automatically group students into groups.',
    },
    {
      src: manualGroup,
      title: 'Manual Grouping',
      content:
        'You can also group students manually by clicking the group students button.',
    },
    {
      src: unitTest,
      title: 'Unit Test',
      content:
        'Unit Test panel is divided into 3 parts. Starter Code: This part is hidden to students and is used to initialize each of the unit tests. Student Code Template: This part is displayed to students and students will write their code based on this template. Unit Tests: This part is also hidden to students and includes code that checks whether the parameters of the students match up.',
    },
    {
      src: createUnitTest,
      title: 'Create Unit Test',
      content:
        'Unit Tests can be automatically created by specifying input and output. Create unit tests by (1) Click add and enter the desired parameter and return value of the function. And after creating all tests, (2) Press Generate Unit Test to automatically generate tests that can be run by students. ***Note that right now we only support functions that take in one parameter. Multiple parameters must be stored in one array parameter and be read in the function itself.',
    },
    {
      src: codeIssues,
      title: 'Code Issues',
      content:
        "Code issues capture all error messages from the student's code. The percentage of students making a particular error will be shown, as well as the exact error messages shown as a dropdown.        ",
    },
    {
      src: performance,
      title: 'Student Performance',
      content:
        'This window documents the percentage of students passing each unit tests (the percentage next to the name of each test). The green progress bar shows the general performance of the whole class.        ',
    },
    {
      src: grouping,
      title: 'Grouping',
      content:
        'Each group displays the passrate of the unit tests and the conversation progress of each group. The passrate of each group is measured through the number of unit test it passed while the conversation progress measures how relevant the conversations between students are towards reaching the final answer.',
    },
    {
      src: chatting,
      title: 'Chatting',
      content:
        'You can chat with each student in the group through group messages, as well as chatting through private messages.        ',
    },
    {
      src: codeView,
      title: 'Code Viewing',
      content:
        'You can also view the student’s code at different instances clicking different messages.  Each code will have a timestamp when the code is written, as well as the passing percentage of the particular test. You can also view each student’s latest code by clicking on the profile picture.',
    },
  ]
  const handleNextSlide = () => {
    setContentIndex(contentIndex + 1)
  }
  const hanglePreviousSlide = () => {
    if (contentIndex !== 0) {
      setContentIndex(contentIndex - 1)
    }
  }
  return (
    <>
      <Button
                onClick={() => setOpen(true)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Tutorial
              </Button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ModalOverflow>
          <ModalDialog
            aria-labelledby="layout-modal-title"
            aria-describedby="layout-modal-description"
            layout="center">
            <Sheet
              variant="outlined"
              sx={{
                maxWidth: 1000,
                borderRadius: 'md',
                p: 3,
                boxShadow: 'lg',
              }}>
              <ModalClose
                variant="outlined"
                sx={{
                  top: 'calc(-1/4 * var(--IconButton-size))',
                  right: 'calc(-1/4 * var(--IconButton-size))',
                  boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
                  borderRadius: '50%',
                  bgcolor: 'background.surface',
                }}
              />
              {contentArray.map((content, index) => (
                <div key={index}>
                  <Divider>
                    <Chip variant="soft" color="neutral" size="sm">
                      {content.title}
                    </Chip>
                  </Divider>
                  <img
                    className="tutorialImage"
                    src={content.src}
                    alt="layout"
                    style={{
                      maxHeight: 600,
                      maxWidth: 1000,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingTop: 30,
                    }}
                  />
                  <Typography
                    component="h2"
                    id="modal-title"
                    level="h4"
                    textColor="inherit"
                    fontWeight="lg"
                    mb={1}>
                    {content.title}
                  </Typography>
                  <Typography
                    id="modal-desc"
                    textColor="text.tertiary"
                    sx={{ paddingBottom: 20 }}>
                    {content.content}
                  </Typography>
                </div>
              ))}
            </Sheet>
          </ModalDialog>
        </ModalOverflow>
      </Modal>
    </>
  )
}

export default TutorialModal
