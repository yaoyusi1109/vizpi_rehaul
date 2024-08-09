import React, { useEffect, useContext, useState } from 'react'
/**Output pannel of code, on the right hand side of the student dashboard*/
const PythonInterpreter = ({ output }) => {
  return <textarea className="codeOutputArea" value={output} readOnly />
}

export default PythonInterpreter
