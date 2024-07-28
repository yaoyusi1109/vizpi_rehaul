import React, { useContext, useState, useRef, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { showToast } from '../commonUnit/Toast'
import {
  updateTaskInSession,
  addQuizInSession,
  setEnableQuizInSession,
} from '../../service/sessionService'
import {
  Button,
  Typography,
  Box,
  Modal,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { SessionContext } from '../../context/SessionContext'
import { filterProfanity } from '../../tool/profanityFilter'
import '../../css/taskcard.scss'
import { getQuizQuestions } from '../../tool/getQuiz'
import FixTaskModal from '../commonUnit/FixTaskModal'
import SubjectIcon from '@mui/icons-material/Subject';


const TaskCard = () => {
  const { currentUser } = useContext(AuthContext)
  const { session, setSession } = useContext(SessionContext)
  const [isEditable, setEditable] = useState(false)
  const [taskContent, setTaskContent] = useState('')
  const textAreaRef = useRef()
  const [chatEnable, setChatEnable] = useState(false)
  const [quiz, setQuiz] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [quizEnable, setQuizEnable] = useState(false)

  useEffect(() => {
    if (!session) return
    if (!session.task) return
    setTaskContent(session.task)
    setChatEnable(session.enable_chat)
    setQuizEnable(session.enable_quiz)
    if (session.quiz) {
      setQuizQuestions(session.task)
    } else {
      fetchQuizQuestions(session.task)
    }
  }, [session])

  const setQuizQuestions = async (task) => {
    if (!task) return
    try {
      setQuiz(session.quiz)
    } catch (error) {
      console.error('Error setting quiz questions:', error)
    }
  }

  const fetchQuizQuestions = async (task) => {
    if (!isUpdating) {
      setIsUpdating(true)
      try {
        const newQuiz = await getQuizQuestions(task)
        const res = await addQuizInSession(currentUser.session_id, newQuiz)
        if (!res) {
          //console.log('Quiz update failed!');
        } else {
          setQuiz(newQuiz)
        }
      } catch (error) {
        console.error('Error fetching quiz questions:', error)
      }
      setIsUpdating(false)
    }
  }

  const fixDescription = () => {
    setIsModalOpen(true)
  }

  const handleTaskContentChange = (e) => {
    setTaskContent(e.target.value)
  }

  const handleEditClick = () => {
    setEditable(!isEditable)
    if (!isEditable) {
      setTimeout(() => textAreaRef.current.focus(), 0)
    }
    setTaskContent(session.task)
  }

  const handleUpdateClick = async () => {
    if (taskContent !== filterProfanity(taskContent)) {
      showToast('Please do not use profanity.', 'error')
      return
    }
    const success = await updateTaskInSession(
      currentUser.session_id,
      taskContent
    )
    if (success) {
      setEditable(false)
      fetchQuizQuestions(taskContent)
    } else {
    }
  }

  const handleEnableQuizChange = async () => {
    const newQuizEnable = !quizEnable
    setQuizEnable(newQuizEnable)

    //console.log("quiz is now:", newQuizEnable);

    const res = await setEnableQuizInSession(
      currentUser.session_id,
      newQuizEnable
    )
    //console.log("quiz is now in db:", session.enable_quiz );
  }

  const alphabetLabels = ['a', 'b', 'c', 'd', 'e']

  return (
    <div className="taskCard" sx={{ display: 'flex' }}>
          <Typography variant="h6" fontWeight="light"  className="title-container">
      <SubjectIcon className="subject-icon" />
      <span>Task Description</span>
    </Typography>
      <div className="task-area">
        <textarea
          ref={textAreaRef}
          className="exercise-area"
          disabled={!isEditable || currentUser.role > 1}
          value={taskContent}
          onChange={handleTaskContentChange}
          autoFocus={isEditable}
        />
      </div>
      <div className="exerciseBar">
        {currentUser.role <= 1 && ( 
          <>
            {isEditable ? (
              <>
                <Button
                  className="action-btn"
                  variant="contained"
                  color="error"
                  onClick={handleEditClick}>
                  Cancel
                </Button>
                <Button
                  className="action-btn"
                  variant="contained"
                  color="primary"
                  onClick={fixDescription}>
                  AI Assistant
                </Button>
                <Button
                  className="action-btn"
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateClick}>
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="action-btn"
                  variant="contained"
                  color="primary"
                  onClick={handleEditClick}>
                  Edit
                </Button>
              </>
            )}
          </>
        )}
      </div>

      {currentUser?.role <= 1 && session?.type !== 'Audio' && (
        <>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" fontWeight="light" sx={{ marginRight: 1 }}>
              Pre-coding Questions
            </Typography>
            <FormControlLabel
              value="top"
              labelPlacement="end"
              control={
                <Switch
                  className="switch"
                  checked={quizEnable}
                  onChange={handleEnableQuizChange}
                  color="primary"
                />
              }
            />
          </Box>
          {quizEnable ? (
            <>
              <Typography variant="subtitle1" fontWeight="light" gutterBottom>
                These AI-generated quiz questions are randomly assigned to all
                students to ensure they understand the task before coding.
              </Typography>
              {!isUpdating ? (
                <>
                  <Box
                    sx={{
                      padding: 1,
                      backgroundColor: '#FAFAFA',
                      mb: 2,
                      borderRadius: '3%',
                      marginBottom: 0,
                    }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      sx={{ marginBottom: 2 }}>
                      {quiz?.multipleChoice?.length > 0 && (
                        <Box width="48%">
                          <Typography variant="subtitle1">
                            Multiple Choice:
                          </Typography>
                          {quiz.multipleChoice.map((question, index) => (
                            <div
                              key={`multipleChoice-${index}-${question.parameter}`}>
                              <Typography
                                variant="caption"
                                color="textSecondary">
                                {index + 1}. {quiz.functionName}(
                                {question.parameter.replace(/;\s/g, ', ')})
                                returns {question.return}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary">
                                <ul style={{ listStyle: 'none' }}>
                                  {question.choices.map((choice, idx) => (
                                    <li key={`choice-${index}-${idx}`}>
                                      {alphabetLabels[idx]}. {choice}
                                    </li>
                                  ))}
                                </ul>
                              </Typography>
                            </div>
                          ))}
                        </Box>
                      )}
                      {quiz?.unitTests?.length > 0 && (
                        <Box width="48%">
                          <Typography variant="subtitle1">
                            Fill-in-the-blank:
                          </Typography>
                          {quiz.unitTests.map((question, index) => (
                            <div
                              key={`unitTest-${index}-${question.parameter}`}>
                              <Typography
                                variant="caption"
                                color="textSecondary">
                                {index + 1}. {quiz.functionName}(
                                {question.parameter.replace(/;\s/g, ', ')})
                                returns {question.return}
                              </Typography>
                            </div>
                          ))}
                        </Box>
                      )}
                    </Box>
                    {quiz?.hint?.length > 0 && (
                      <>
                        <Typography variant="subtitle1" fontWeight={400}>
                          Hint for students:
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {quiz.hint}
                        </Typography>
                      </>
                    )}
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    padding: 1,
                    backgroundColor: '#FAFAFA',
                    mb: 2,
                    borderRadius: '3%',
                    height: window.innerHeight / 3,
                    marginBottom: 0,
                  }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="light"
                    gutterBottom>
                    Updating pre-coding questions...
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            <Box
              sx={{
                padding: 1,
                backgroundColor: '#FAFAFA',
                mb: 2,
                borderRadius: '3%',
              }}>
              {/* Pre-coding questions are currently disabled. */}
            </Box>
          )}
          {currentUser?.role <= 1 && quizEnable && (
            <div className="exerciseBar">
              <Button
                className="action-btn"
                variant="contained"
                color="primary"
                disabled={isUpdating}
                sx={{ marginBottom: 2 }}
                onClick={() => fetchQuizQuestions(taskContent)}>
                Regenerate
              </Button>
            </div>
          )}
        </>
      )}
      {isModalOpen && (
        <FixTaskModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          taskContent={taskContent}
          setTaskContent={setTaskContent}
        />
      )}
    </div>
  )
}

export default TaskCard
