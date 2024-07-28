import { React, useEffect, useContext, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { updateTestInSession } from '../../service/sessionService'
import { SessionContext } from '../../context/SessionContext'
import { AuthContext } from '../../context/AuthContext'
import { showToast } from '../commonUnit/Toast'
import { python } from '@codemirror/lang-python'

const TestPanel = () => {
  const [unitTest, setUnitTest] = useState('#Unit Test')
  const { session } = useContext(SessionContext)
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    setUnitTest(session.test)
  }, [session])

  const handleUpdateClick = async (e) => {
    //console.log(unitTest)
    e.preventDefault()
    const success = await updateTestInSession(currentUser.session_id, unitTest)
    if (success) {
      showToast('Unit Test updated successfully.', 'success')
    } else {
      showToast('Failed to update unit test.', 'error')
    }
  }

  const handleTestChange = (e) => {
    e.preventDefault()
    setUnitTest(e)
  }
  return (
    <div className="scafold">
      <CodeMirror
        className="codeTestArea"
        value={unitTest}
        extensions={[python(), indentUnit.of('    ')]}
        onChange={handleTestChange}
        editable={currentUser?.role > 1 ? false : true}
      />
    </div>
  )
}

export default TestPanel
