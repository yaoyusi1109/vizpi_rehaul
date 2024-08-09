import { Try } from '@mui/icons-material'
import React, { useContext, useEffect, useState } from 'react'

const BlockpyMirror = ({currentCode,onCodeChange,configuration,divID}) => {
  const [mirror,setMirror] = useState()

  const onChange = (event) => {
    let blocksUsed = []
    console.log(mirror)
    console.log(event)
    console.log(window.Blockly.mainWorkspace.typedBlocksDB_)
    console.log(window.Blockly)
    console.log(window.Blockly.mainWorkspace.getAllBlocks())
    try {
      let blocks = Array.from(Object.keys(window?.Blockly?.mainWorkspace?.typedBlocksDB_))
    for( let i = 0;i < blocks.length;i++){
      let code = window.Blockly.Python.blockToCode(window.Blockly.mainWorkspace.typedBlocksDB_[blocks[i]][0])
      blocksUsed.push({
        name:blocks[i],
        code:(typeof code === 'string' || code instanceof String)? code : code[0]
      })
      console.log(window.Blockly.Python.blockToCode(window.Blockly.mainWorkspace.typedBlocksDB_[blocks[i]][0]))
    }
    
    onCodeChange(event.value,blocksUsed)
      
    } catch (error) {
      onCodeChange(event.value,[{}])
    }
    
  }


  useEffect(() => {
    if(mirror==null){
      const editor = new window.BlockMirror({
        'container': document.getElementById(divID),
        ...configuration
      });
      if(onCodeChange){
        editor.addChangeListener(onChange);
      }
      if(currentCode){
        editor.setCode(currentCode);
      }
      setMirror(editor)
      console.log(editor)
    }
    else{
      mirror.setCode(currentCode)
    }
    
    


  }, [currentCode])
  


  return (
    <div id={divID} style={{height:configuration.height?configuration.height:500}}></div>
    
  )
}

export default BlockpyMirror
