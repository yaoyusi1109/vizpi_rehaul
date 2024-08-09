import React, { useContext, useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { AuthContext } from '../../context/AuthContext'
import { showToast } from '../commonUnit/Toast'
import { githubLight } from '@uiw/codemirror-theme-github'
import { updateTestCodeInSession } from '../../service/testService'
import { SessionContext } from '../../context/SessionContext'
import { indentUnit } from '@codemirror/language'
import { Typography } from '@mui/material'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import { addCodeAndUpdateUser, getCodeById } from "../../service/codeService"
import BlockpyMirror from '../code/BlockpyMirror';

const StarterCode = () => {
  const { currentUser } = useContext(AuthContext)
  const { rerender,setRerender } = useContext(SelectedCodeContext)
  const [starterCode, setStarterCode] = useState('#StarterCode')
  const [unitTest, setUnitTest] = useState('#Unit Test')
  const [templateCode, setTemplateCode] = useState('')
  const { session } = useContext(SessionContext)

  useEffect(() => {
    console.log(session)
    if (!session || !session.test_code) return
    if(session.type.startsWith("SQL")){
      getCodeById(session.test_code.starter).then((code)=>{
        console.log(code)
        if(code!=null){
          setStarterCode(code.content)
        }
      })
    }
    else{
      setStarterCode(session.test_code.starter)
    }
    
    setTemplateCode(session.test_code.template)
    setUnitTest(session.test_code.unit_test)
  }, [session])

  if (!session) return null

  const handleStarterCodeChange = (e) => {
    setStarterCode(e)
  }

  const handleTestChange = (e) => {
    setUnitTest(e)
  }

  const handleTemplateChange = (e) => {
    setTemplateCode(e)
  }

  const handleUpdateClick = async (e) => {
    console.log(e)
    e?.preventDefault()
    console.log(templateCode)
    if(session.type.startsWith("SQL")){
      const result = await addCodeAndUpdateUser(
        starterCode,
        0,
        currentUser.id,
        null
      )
      console.log(result)
      const success = await updateTestCodeInSession(session.id, {
        starter: result.code.id,
        template: templateCode,
        unit_test: unitTest,
      })
      console.log(success)
  
      if (success) {
        showToast('Test updated successfully.', 'success')
      } else {
        showToast('Failed to update starter code.', 'error')
      }
      return
    }
    const success = await updateTestCodeInSession(session.id, {
      starter: starterCode,
      template: templateCode,
      unit_test: unitTest,
    })
    console.log(success)

    if (success) {
      showToast('Test updated successfully.', 'success')
    } else {
      showToast('Failed to update starter code.', 'error')
    }
  }

  return (
    <div className="scafold">
      <Typography variant="h6" fontWeight={'light'} gutterBottom>
        Unit Test
      </Typography>
      <div className="topbar">
        {session.test_code &&
        (starterCode === session.test_code.starter||session.type.startsWith("SQL") )&&
        templateCode === session.test_code.template &&
        unitTest === session.test_code.unit_test ? (
          <></>
        ) : (
          <button className="codeButton" onClick={handleUpdateClick}>
            Save
          </button>
        )}
      </div>
      Variable Setup
      <CodeMirror
        extensions={[python(), indentUnit.of('    ')]}
        theme={githubLight}
        value={starterCode}
        height={currentUser?.role > 1 ? '100px' : (session.type.startsWith("SQL")?'50vh':'200px')}
        onChange={handleStarterCodeChange}
        onBlur={handleUpdateClick}
        editable={currentUser?.role > 1 ? false : true}/>
      
      {!session.type.startsWith("SQL") && (
        <>
        Student Code Template
        {session?.type?.startsWith("Blockly") && (
          <span key={rerender}>
            <BlockpyMirror
            currentCode={templateCode}
            onCodeChange={(code,blocks)=>{
              setTemplateCode(code)
              console.log(session)
              console.log(starterCode)
              updateTestCodeInSession(session.id, { starter: session.test_code.starter, template: code, unit_test: session.test_code.unit_test, })
            }}
            configuration={{
              'toolbox':"ct2",
              "blocklyMediaPath": "../lib/blockly/media/",
              "viewMode": 'block',
              "height": 300
            }}
            divID={'blockmirror-editor'}
            />
          </span>
        )}
        {!session?.type?.startsWith("Blockly") && (
          <CodeMirror
          value={templateCode}
          theme={githubLight}
          extensions={[python(), indentUnit.of('    ')]}
          height={currentUser?.role > 1 ? '100px' : '200px'}
          onChange={handleTemplateChange}
          onBlur={handleUpdateClick}
          editable={currentUser?.role > 1 ? false : true}
        />
        )}
        
        </>
      )}
      
      
      
      Unit Test
      <CodeMirror
        value={unitTest}
        theme={githubLight}
        extensions={[python(), indentUnit.of('    ')]}
        height={currentUser?.role > 1 ? '100px' : '20vh'}
        onChange={handleTestChange}
        onBlur={handleUpdateClick}
        editable={currentUser?.role > 1 ? false : true}
      />
    </div>
  )
}
export default StarterCode
