// CreateSessionModal.js
import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { addSession } from '../../service/sessionService'
import { getCourseList } from '../../service/courseService'

const CreateSessionModal = ({ showModal, onClose }) => {
  const [courseNumber, setCourseNumber] = useState('')
  const [courseNumbers, setCourseNumbers] = useState([])
  const [task, setTask] = useState('')
  const [subject, setSubject] = useState('')
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    const fetchCourseNumbers = async () => {
      const courseNumbers = getCourseList().then((courseNumbers) => {
        setCourseNumbers(courseNumbers)
      })
    }
    fetchCourseNumbers()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    addSession(courseNumber, task, subject, currentUser).then(() => {
      // window.location.reload()
    })
  }

  if (!showModal) {
    return null
  }

  return (
    <div className="modal-background">
      <div className="modal">
        <h2>Create New Session</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Course Number:
            <select
              value={courseNumber}
              onChange={(e) => setCourseNumber(e.target.value)}>
              <option value="">Select a course</option>
              {courseNumbers.map((number, index) => (
                <option key={index} value={number}>
                  {'CRN ' + number}
                </option>
              ))}
            </select>
          </label>

          <label>
            Subject:
            <textarea
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </label>
          <label>
            Task:
            <textarea value={task} onChange={(e) => setTask(e.target.value)} />
          </label>
          <button type="submit">Confirm</button>
          <button onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  )
}

export default CreateSessionModal
