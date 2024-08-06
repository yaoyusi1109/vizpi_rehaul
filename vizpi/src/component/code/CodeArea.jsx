import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import CodeMirror from '@uiw/react-codemirror'
import { AuthContext } from '../../context/AuthContext'
import { getCodeByUser } from '../../service/sessionService'
import { python } from '@codemirror/lang-python'
import { ModeContext } from '../../context/ModeContext'
import { Button } from '@mui/material'
import { SessionContext } from '../../context/SessionContext'
import { indentUnit } from '@codemirror/language'
import { HighlightMenu, MenuButton } from 'react-highlight-menu'
import '../../css/codearea.scss'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { IconButton } from '@mui/joy'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { MessageContext } from '../../context/MessageContext'
import TextField from '@mui/material/TextField'
import DoneIcon from '@mui/icons-material/Done'
import { BlocklyWorkspace } from 'react-blockly';
import {pythonGenerator} from 'blockly/python'
import {getUserById} from '../../service/userService'
import { getCodeById } from '../../service/codeService'
import BlockpyMirror from './BlockpyMirror';
import { getUserSubmissions } from '../../service/submissionService'

const CodeArea = ({ onCodeChange, runCode }) => {
  const { selectedCode, setSelectedCode,rerender,setRerender } = useContext(SelectedCodeContext)
  const { currentUser } = useContext(AuthContext)
  const { Mode } = useContext(ModeContext)
  const { session } = useContext(SessionContext)
  const [open, setOpen] = useState(false)
  const [codeText, setCodeText] = useState('')
  const codeRef = useRef()
  const [questionList, setQuestionList] = useState([
    'Is this line corrent?',
    'How to use this function?',
  ])
  const { setChatMessage } = useContext(MessageContext)
  const [textField, setTextField] = useState(false)
  const [update, setUpdate] = useState(false)
  const [customQuestion, setCustomQuestion] = useState('')
  const [disabledButton, setDisabledButton] = useState(false)
  const [xml, setXml] = useState("");
  const [blocksUsed, setBlocksUsed] = useState([])

  const toolbox = {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: 'Lists',
        colour: 259,
        contents: [
          {
            kind: 'block',
            blockxml:
              '    <block type="lists_indexOf">\n' +
              '      <field name="END">FIRST</field>\n' +
              '      <value name="VALUE">\n' +
              '        <block type="variables_get">\n' +
              '          <field name="VAR" id="e`(L;x,.j[[XN`F33Q5." variabletype="">list</field>\n' +
              '        </block>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml: '    <block type="lists_create_with">\n' + '      <mutation items="0"></mutation>\n' + '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="lists_repeat">\n' +
              '      <value name="NUM">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">5</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            type: 'lists_length'
          },
          {
            kind: 'block',
            type: 'lists_isEmpty'
          },
          {
            kind: 'block',
            blockxml: '    <block type="lists_create_with">\n' + '      <mutation items="3"></mutation>\n' + '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="lists_getIndex">\n' +
              '      <mutation statement="false" at="true"></mutation>\n' +
              '      <field name="MODE">GET</field>\n' +
              '      <field name="WHERE">FROM_START</field>\n' +
              '      <value name="VALUE">\n' +
              '        <block type="variables_get">\n' +
              '          <field name="VAR" id="e`(L;x,.j[[XN`F33Q5." variabletype="">list</field>\n' +
              '        </block>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="lists_setIndex">\n' +
              '      <mutation at="true"></mutation>\n' +
              '      <field name="MODE">SET</field>\n' +
              '      <field name="WHERE">FROM_START</field>\n' +
              '      <value name="LIST">\n' +
              '        <block type="variables_get">\n' +
              '          <field name="VAR" id="e`(L;x,.j[[XN`F33Q5." variabletype="">list</field>\n' +
              '        </block>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="lists_getSublist">\n' +
              '      <mutation at1="true" at2="true"></mutation>\n' +
              '      <field name="WHERE1">FROM_START</field>\n' +
              '      <field name="WHERE2">FROM_START</field>\n' +
              '      <value name="LIST">\n' +
              '        <block type="variables_get">\n' +
              '          <field name="VAR" id="e`(L;x,.j[[XN`F33Q5." variabletype="">list</field>\n' +
              '        </block>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="lists_split">\n' +
              '      <mutation mode="SPLIT"></mutation>\n' +
              '      <field name="MODE">SPLIT</field>\n' +
              '      <value name="DELIM">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT">,</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml: '    <block type="lists_sort">\n' + '      <field name="TYPE">NUMERIC</field>\n' + '      <field name="DIRECTION">1</field>\n' + '    </block>\n'
          }
        ]
      },
      {
        kind: 'category',
        name: 'Logic',
        colour: 210,
        contents: [
          {
            kind: 'block',
            type: 'controls_if'
          },
          {
            kind: 'block',
            blockxml: '<block type="logic_compare"><field name="OP">EQ</field></block>'
          },
          {
            kind: 'block',
            blockxml: '<block type="logic_operation"><field name="OP">AND</field></block>'
          },
          {
            kind: 'block',
            type: 'logic_negate'
          },
          {
            kind: 'block',
            blockxml: '<block type="logic_boolean"><field name="BOOL">TRUE</field></block>'
          },
          {
            kind: 'block',
            type: 'logic_null'
          },
          {
            kind: 'block',
            type: 'logic_ternary'
          }
        ]
      },
      {
        kind: 'category',
        name: 'Loops',
        colour: 120,
        contents: [
          {
            kind: 'block',
            blockxml:
              '<block type="controls_repeat_ext">\n' +
              '      <value name="TIMES">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">10</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>'
          },
          {
            kind: 'block',
            blockxml: '    <block type="controls_whileUntil">\n' + '      <field name="MODE">WHILE</field>\n' + '    </block>'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="controls_for">\n' +
              '      <field name="VAR" id="C(8;cYCF}~vSgkxzJ+{O" variabletype="">i</field>\n' +
              '      <value name="FROM">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">1</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '      <value name="TO">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">10</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '      <value name="BY">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">1</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml: '    <block type="controls_forEach">\n' + '      <field name="VAR" id="Cg!CSk/ZJo2XQN3=VVrz" variabletype="">j</field>\n' + '    </block>\n'
          },
          {
            kind: 'block',
            blockxml: '    <block type="controls_flow_statements">\n' + '      <field name="FLOW">BREAK</field>\n' + '    </block>\n'
          }
        ]
      },
      {
        kind: 'category',
        name: 'Math',
        colour: 230,
        contents: [
          // {
          //   kind: 'block',
          //   blockxml:
          //     '    <block type="math_round">\n' +
          //     '      <field name="OP">ROUND</field>\n' +
          //     '      <value name="NUM">\n' +
          //     '        <shadow type="math_number">\n' +
          //     '          <field name="NUM">3.1</field>\n' +
          //     '        </shadow>\n' +
          //     '      </value>\n' +
          //     '    </block>\n'
          // },
          {
            kind: 'block',
            blockxml: '    <block type="math_number">\n' + '      <field name="NUM">0</field>\n' + '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="math_single">\n' +
              '      <field name="OP">ROOT</field>\n' +
              '      <value name="NUM">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">9</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="math_trig">\n' +
              '      <field name="OP">SIN</field>\n' +
              '      <value name="NUM">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">45</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml: '    <block type="math_constant">\n' + '      <field name="CONSTANT">PI</field>\n' + '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="math_number_property">\n' +
              '      <mutation divisor_input="false"></mutation>\n' +
              '      <field name="PROPERTY">EVEN</field>\n' +
              '      <value name="NUMBER_TO_CHECK">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">0</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="math_arithmetic">\n' +
              '      <field name="OP">ADD</field>\n' +
              '      <value name="A">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">1</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '      <value name="B">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">1</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml: '    <block type="math_on_list">\n' + '      <mutation op="SUM"></mutation>\n' + '      <field name="OP">SUM</field>\n' + '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="math_modulo">\n' +
              '      <value name="DIVIDEND">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">64</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '      <value name="DIVISOR">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">10</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="math_constrain">\n' +
              '      <value name="VALUE">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">50</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '      <value name="LOW">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">1</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '      <value name="HIGH">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">100</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="math_random_int">\n' +
              '      <value name="FROM">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">1</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '      <value name="TO">\n' +
              '        <shadow type="math_number">\n' +
              '          <field name="NUM">100</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            type: 'math_random_float'
          }
        ]
      },
      {
        kind: 'category',
        name: 'Text',
        colour: 160,
        contents: [
          {
            kind: 'block',
            blockxml:
              '    <block type="text_charAt">\n' +
              '      <mutation at="true"></mutation>\n' +
              '      <field name="WHERE">FROM_START</field>\n' +
              '      <value name="VALUE">\n' +
              '        <block type="variables_get">\n' +
              '          <field name="VAR" id="q@$ZF(L?Zo/z`d{o.Bp!" variabletype="">text</field>\n' +
              '        </block>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml: '    <block type="text">\n' + '      <field name="TEXT"></field>\n' + '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="text_append">\n' +
              '      <field name="VAR" id=":};P,s[*|I8+L^-.EbRi" variabletype="">item</field>\n' +
              '      <value name="TEXT">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT"></field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="text_length">\n' +
              '      <value name="VALUE">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT">abc</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="text_isEmpty">\n' +
              '      <value name="VALUE">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT"></field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="text_indexOf">\n' +
              '      <field name="END">FIRST</field>\n' +
              '      <value name="VALUE">\n' +
              '        <block type="variables_get">\n' +
              '          <field name="VAR" id="q@$ZF(L?Zo/z`d{o.Bp!" variabletype="">text</field>\n' +
              '        </block>\n' +
              '      </value>\n' +
              '      <value name="FIND">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT">abc</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml: '    <block type="text_join">\n' + '      <mutation items="2"></mutation>\n' + '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="text_getSubstring">\n' +
              '      <mutation at1="true" at2="true"></mutation>\n' +
              '      <field name="WHERE1">FROM_START</field>\n' +
              '      <field name="WHERE2">FROM_START</field>\n' +
              '      <value name="STRING">\n' +
              '        <block type="variables_get">\n' +
              '          <field name="VAR" id="q@$ZF(L?Zo/z`d{o.Bp!" variabletype="">text</field>\n' +
              '        </block>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="text_changeCase">\n' +
              '      <field name="CASE">UPPERCASE</field>\n' +
              '      <value name="TEXT">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT">abc</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="text_trim">\n' +
              '      <field name="MODE">BOTH</field>\n' +
              '      <value name="TEXT">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT">abc</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="text_print">\n' +
              '      <value name="TEXT">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT">abc</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          },
          {
            kind: 'block',
            blockxml:
              '    <block type="text_prompt_ext">\n' +
              '      <mutation type="TEXT"></mutation>\n' +
              '      <field name="TYPE">TEXT</field>\n' +
              '      <value name="TEXT">\n' +
              '        <shadow type="text">\n' +
              '          <field name="TEXT">abc</field>\n' +
              '        </shadow>\n' +
              '      </value>\n' +
              '    </block>\n'
          }
        ]
      },

      // {
      //   kind: 'category',
      //   name: 'Colour',
      //   colour: 19,
      //   contents: [
      //     {
      //       kind: 'block',
      //       blockxml: '    <block type="colour_picker">\n' + '      <field name="COLOUR">#ff0000</field>\n' + '    </block>\n'
      //     },
      //     {
      //       kind: 'block',
      //       type: 'colour_random'
      //     },
      //     {
      //       kind: 'block',
      //       blockxml:
      //         '    <block type="colour_rgb">\n' +
      //         '      <value name="RED">\n' +
      //         '        <shadow type="math_number">\n' +
      //         '          <field name="NUM">100</field>\n' +
      //         '        </shadow>\n' +
      //         '      </value>\n' +
      //         '      <value name="GREEN">\n' +
      //         '        <shadow type="math_number">\n' +
      //         '          <field name="NUM">50</field>\n' +
      //         '        </shadow>\n' +
      //         '      </value>\n' +
      //         '      <value name="BLUE">\n' +
      //         '        <shadow type="math_number">\n' +
      //         '          <field name="NUM">0</field>\n' +
      //         '        </shadow>\n' +
      //         '      </value>\n' +
      //         '    </block>\n'
      //     },
      //     {
      //       kind: 'block',
      //       blockxml:
      //         '    <block type="colour_blend">\n' +
      //         '      <value name="COLOUR1">\n' +
      //         '        <shadow type="colour_picker">\n' +
      //         '          <field name="COLOUR">#ff0000</field>\n' +
      //         '        </shadow>\n' +
      //         '      </value>\n' +
      //         '      <value name="COLOUR2">\n' +
      //         '        <shadow type="colour_picker">\n' +
      //         '          <field name="COLOUR">#3333ff</field>\n' +
      //         '        </shadow>\n' +
      //         '      </value>\n' +
      //         '      <value name="RATIO">\n' +
      //         '        <shadow type="math_number">\n' +
      //         '          <field name="NUM">0.5</field>\n' +
      //         '        </shadow>\n' +
      //         '      </value>\n' +
      //         '    </block>\n'
      //     }
      //   ]
      // },
      { kind: 'sep' },
      {
        kind: 'category',
        name: 'Variables',
        custom: 'VARIABLE',
        colour: 330
      },
      {
        kind: 'category',
        name: 'Functions',
        custom: 'PROCEDURE',
        colour: 290
      }
    ]
  }
  const DEFAULT_OPTIONS = {
    collapse: true,
    comments: true,
    disable: true,
    maxBlocks: Infinity,
    trashcan: true,
    horizontalLayout: false,
    toolboxPosition: 'START',
    css: true,
    media: 'https://blockly-demo.appspot.com/static/media/',
    rtl: false,
    scrollbars: true,
    sounds: true,
    oneBasedIndex: true,
    grid: {
      spacing: 20,
      length: 1,
      colour: '#888',
      snap: true
    },
    zoom: {
      controls: true,
      wheel: false,
      startScale: 1,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    maxInstances: {
      alert_context: 1
    }
  };



  useEffect(() => {
    console.log(currentUser)
    console.log(selectedCode)
    if (!currentUser) return
    if (!selectedCode && currentUser.role === 3) {
      getUserById(currentUser.id).then((updatedSelf) =>{
        console.log(updatedSelf)
        if(updatedSelf.code_id){
          getCodeById(updatedSelf.code_id).then((code) => {
            console.log(code)
            if (code !== null) setSelectedCode(code)
            else
              setSelectedCode({
                content: session?.test_code?.template,
                passrate: 0,
              })
            //console.log(code)
          })
        }
        else{
          getUserSubmissions(session.id,currentUser.id).then((codes) => {
            console.log(codes)
            codes.sort(function(x, y){
              return new Date(y.created_time) - new Date(x.created_time);
            })
            if (codes?.length>0&&codes[0] !== null){
              getCodeById(codes[0].code_id).then((code) => {
                console.log(code)
                if (code !== null) setSelectedCode(code)
                else
                  setSelectedCode({
                    content: session?.test_code?.template,
                    passrate: 0,
                  })
                //console.log(code)
              })
            }
            else
              setSelectedCode({
                content: session?.test_code?.template,
                passrate: 0,
              })
            //console.log(code)
          })
        }
        
      })
      
    }
  }, [currentUser])
  useEffect(() => {
    console.log(selectedCode)
    if(selectedCode?.content!==xml){
      //setRerender(Date.now())
      setUpdate(false)
    }
  }, [selectedCode])

  useEffect(() => {
    //onCodeChange(xml,codeText,blocksUsed)
    //console.log("hi")
  }, [codeText])

  const handleOpen = (selectedText, setMenuOpen) => {
    setCodeText(selectedText)
    setOpen(true)
    setMenuOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
    setTextField(false)
    setDisabledButton(false)
  }

  const handleSetMessage = (message, code) => {
    const formattedMessage = `${code}\n${message}`
    //console.log(formattedMessage)
    setChatMessage(formattedMessage)
    setOpen(false)
  }

  const handleShowTextField = () => {
    setTextField(true)
    setDisabledButton(true)
  }
  
  const workspaceChange = (workspace) => {
    //console.log(workspace)
    setBlocksUsed(Array.from(workspace.typedBlocksDB.keys()).join(" "))
    const generatedCode = pythonGenerator.workspaceToCode(workspace)
    if(generatedCode!=codeText){
      setCodeText(generatedCode)
      setUpdate(true)
    }
    
    ////console.log(xml)
    //onCodeChange(xml,generatedCode,[])
  }
  
  const onXmlChange = (newXml) => {
    ////console.log(newXml)
    setXml(newXml)
    if(update){
      setUpdate(false)
      onCodeChange(newXml,codeText,blocksUsed)
    }
    //onCodeChange(newXml,codeText,blocksUsed)
  }


  return (
    <>
      {currentUser.role == 3 && (
        <HighlightMenu
          styles={{
            borderColor: 'white',
            backgroundColor: 'white',
            boxShadow: '0px 5px 5px 0px rgba(0, 0, 0, 0.15)',
            zIndex: 10,
            borderRadius: '5px',
            padding: '3px',
          }}
          target={codeRef}
          menu={({ selectedText, setMenuOpen, setClipboard }) => (
            <>
              <IconButton onClick={() => handleOpen(selectedText, setMenuOpen)}>
                <QuestionMarkIcon />
              </IconButton>
            </>
          )}
        />
      )}
      <div ref={codeRef} className="full-size" style={{height:"500px"}}>
        {session.type?.startsWith("Blockly") && selectedCode!=null && (
          <span key={rerender}>
            {/* <BlocklyWorkspace 
            className="blockly-editor"
            toolboxConfiguration={toolbox} 
            workspaceConfiguration={DEFAULT_OPTIONS} 
            initialXml={selectedCode?.content}
            onWorkspaceChange = {workspaceChange}
            onXmlChange={onXmlChange}
            /> */}
            <BlockpyMirror
            currentCode={selectedCode?.content}
            onCodeChange={onCodeChange}
            configuration={{
              'toolbox':"ct2",
              "blocklyMediaPath": "../lib/blockly/media/",
              "viewMode": 'split',
              "width": "500ems"
            }}
            divID={'blockmirror-editor'}
            />
            {/* <pre style={{marginLeft:"1em"}}>{codeText}</pre> */}
          </span>
        )}
        <div className="code-mirror-wrapper">
          {!session.type?.startsWith("Blockly") && (
            <CodeMirror
              className="codeTextArea"
              value={selectedCode?.content}
              extensions={[python(), indentUnit.of('    ')]}
              onChange={onCodeChange}
            />
          )}
        </div>
        
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{'Ask a Question'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <pre>{codeText}</pre>
              <List>
                {questionList.map((text, index) => (
                  <ListItem disablePadding key={index}>
                    <ListItemButton
                      onClick={() => handleSetMessage(text, codeText)}>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
                {textField && (
                  <ListItem disablePadding>
                    <TextField
                      id="standard-basic"
                      label="Your Question Here"
                      variant="standard"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                    />
                    <IconButton
                      onClick={() =>
                        handleSetMessage(customQuestion, codeText)
                      }>
                      <DoneIcon color="success" />
                    </IconButton>
                  </ListItem>
                )}
              </List>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Regenerate Questions</Button>
            <Button
              onClick={handleShowTextField}
              autoFocus
              disabled={disabledButton == true}>
              Add a Question
            </Button>
          </DialogActions>
        </Dialog>
        {currentUser.role === 1 && Mode && (
          <Button
            variant="outlined"
            sx={{ width: '100%' }}
            onClick={() => runCode()}>
            Run Code
          </Button>
        )}
      </div>
    </>
  )
}

export default CodeArea
