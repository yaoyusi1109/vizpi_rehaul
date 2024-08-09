import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { BarChart } from '@mui/x-charts/BarChart';
import List from '@mui/material/List'
import { Collapse, ListItemButton, ListItemText, Typography, Box } from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Button } from '@mui/material'
import { getCodeById, searchCodesBySession } from '../../service/codeService'
import { SessionContext } from '../../context/SessionContext'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import { AuthContext } from '../../context/AuthContext'
import { ErrorContext } from '../../context/ErrorContext'
import { getGroupById } from '../../service/groupService'
import { SelectedGroupContext } from '../../context/SelectedGroupContext'
import { filterProfanity } from '../../tool/profanityFilter'
import { getUserById, getUserInSession } from '../../service/userService'
import '../../css/codeIssueGrid.scss'
import { ExpandableText } from '../../tool/expandableText'
import { showToast } from '../commonUnit/Toast'
import { BlocklyWorkspace } from 'react-blockly';
import BlockpyMirror from '../code/BlockpyMirror';

const headers = ['Student Count', 'Error Message',]

export default function CodeIssueListItem({
  error,
  message,
  total_num,
  error_num,
  content,
  code_id,
}) {
  const { selectedCode, setSelectedCode, rerender,setRerender } = useContext(SelectedCodeContext)
  const { currentUser } = useContext(AuthContext)
  const { setError } = useContext(ErrorContext)
  const { session } = useContext(SessionContext)
  const { setSelectedGroup } = useContext(SelectedGroupContext)

  const [open, setOpen] = useState(false)
  const [blocks, setBlocks] = useState({})
  
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
    trashcan: false,
    horizontalLayout: false,
    toolboxPosition: 'START',
    css: true,
    media: 'https://blockly-demo.appspot.com/static/media/',
    rtl: false,
    scrollbars: false,
    sounds: true,
    oneBasedIndex: true,
    grid: {
      spacing: 20,
      length: 1,
      colour: '#888',
      snap: true
    },
    zoom: {
      controls: false,
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
    if(open && session.type =="Blockly"){
      let promises = code_id.map((id)=>{
        return getCodeById(id);
      })
      Promise.all(promises).then((codes) => {
        console.log(codes);
        let blockTypes = {}
        for(let i = 0; i < codes.length; i++){
          console.log(codes[i].content)
          console.log(codes[i])
          for(let j = 0; j < codes[i]?.keystrokes.length;j++){
            if(!blockTypes[codes[i].keystrokes[j].name]){
              blockTypes[codes[i].keystrokes[j].name]={}
            }
            blockTypes[codes[i].keystrokes[j].name].num = (blockTypes[codes[i].keystrokes[j].name].num || 0) +1 ;
            blockTypes[codes[i].keystrokes[j].name].code = codes[i].keystrokes[j].code
          }
        }
        console.log(blockTypes)
        setBlocks(blockTypes)
      });
    }
  }, [open])



  if (!content) {
    //console.log(code_id)
    return null
  }

  const handleClick = () => {
    setOpen(!open)
  }

  const handleChangeGroup = async (currentGroup) => {
    await setSelectedGroup(currentGroup)
  }

  const handleDisplayCode = async (code) => {
    setSelectedCode(code)
    // setTimeout(() => {
    // }, 500)
  }
  const clickShape = (event,params) =>{
    //console.log(event)
    //console.log(params)
    setSelectedCode({
      content:"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\""+params.axisValue+"\" id=\"0sU7$NQg5lC)D_k)-*1]\" x=\"90\" y=\"110\"></block></xml>",
      passrate:0,
    })
  }


  

  const handleInspectCode = async (index, item) => {
    const code = await getCodeById(code_id[index])
    if (code === null) showToast('Code not found', 'error')
    code.content = filterProfanity(code.content)
    //console.log(code)
    const codeUser = await getUserById(code.creater_id)
    const currentGroup = await getGroupById(codeUser?.group_id)

    if (currentGroup !== null) {
      await handleChangeGroup(currentGroup)
    }
    await handleDisplayCode(code)

    setError(item)
  }
  let items = []
  let items_dict = {}
  for (let i = 0; i < content?.length; i++) {
    if (items_dict[content[i]] === undefined) {
      items_dict[content[i]] = [1, i]
    } else {
      // NO OPTION TO SET SEED FOR MATH.RANDOM()
      // items_dict[content[i]] = [items_dict[content[i]][0] + 1, Math.random() >= 0.5 ? i:items_dict[content[i]][1]]
      items_dict[content[i]] = [items_dict[content[i]][0] + 1, i]
    }
  }

  for (let key_ in items_dict) {
    if (items_dict[key_] === undefined) continue
    else {
      items.push(
        <div style={{display:"flex"}}>
          <Box sx={{backgroundColor:key_?.includes("Passed")?"hsla(135, 100%, 47%, 0.5)":(key_?.includes("Failed")?"hsla(1, 100%, 55%, 0.5)":"background.paper"), borderColor: 'text.primary', m: 1, border: 1, minWidth: '1.5rem', minHeight: '1.5rem',maxWidth: '1.5rem', maxHeight: '1.5rem', borderRadius: '50%', textAlign:"center", verticalAlign:"bottom"}} >{items_dict[key_][0]}</Box>
          <Button
            variant="text"
            onClick={() => handleInspectCode(items_dict[key_][1], key_)}>
            <Typography>{key_}</Typography>
          </Button>
        </div>
      )
    }
  }
  

  return (
    <div style={{marginLeft:(content[0]?.includes("Passed") || content[0]?.includes("Failed") || content.length==0)?0:"2em"}}>
      <ListItemButton
        onClick={handleClick}
        sx={{ border: '1px solid grey', borderRadius: '8px' }}>
        <ListItemText
          primary={error + '(' + error_num + '/' + total_num + ')'}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div className="codeIssueGrid">
          {session.type==="Blockly" && (
            <div>
              <BarChart
                height={200}
                series={[
                  { data: Array.from(Object.values(blocks)).map((val)=>val.num), label: 'blocks', id: 'blId' },
                ]}
                xAxis={[{ data: Array.from(Object.keys(blocks)), scaleType: 'band' }]}
                onAxisClick={clickShape}
              />
              <div style={{display:"flex",justifyContent:"space-evenly"}}>
                {Array.from(Object.values(blocks)).map((type,index,alltypes)=>(
                  <div style={{flexGrow:1,width:100/alltypes.length+"%"}}>
                    <span key={rerender}>
                      <BlockpyMirror
                      currentCode={type?.code}
                      configuration={{
                        'toolbox':"empty",
                        "blocklyMediaPath": "../lib/blockly/media/",
                        "viewMode": 'block',
                        "readOnly": true,
                        "height": 100,
                        "trashcan": false,
                        "zoom":{controls:false,},
                        "scrollbars": false
                      }}
                      divID={error+index}
                      />
                    </span>
                    
                  </div>
                  
                ))}
              </div>
              

            </div>
            
          )}
          
          <div className="grid-container" style={{display:"flex",flexDirection:"column"}}>
            {/* <div style={{display:"flex"}}>
              {headers.map((header, index) => (
                <div key={'header' + index} style={{flexGrow:1}} className="grid-header">
                  {header}
                </div>
              ))}
            </div> */}
            <div>
              {items.map((item, index) => (
                <div key={index} style={{display:"flex"}} className="grid-item">
                  {item}
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </Collapse>
    </div>
  )
}