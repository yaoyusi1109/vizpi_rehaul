import React, { useState, useContext, useEffect } from 'react'
import CodeStu from '../code/CodeStu'
import { cn } from '../../pages/SampleSplitter'
import { useResizable } from 'react-resizable-layout'
import SampleSplitter from '../../pages/SampleSplitter'
import '../../css/codeIssuePanel.scss'
import TaskCard from '../topBar/TaskCard'
import Chat from '../chat/Chat'
import { SessionContext } from '../../context/SessionContext'
import TestList from '../topBar/TestList'
import PeerInstruction from './PeerInstruction'
import GroupPassRate from '../topBar/GroupPassRate'
import { SubmissionsProvider } from '../../context/SubmissionsContext'
import DescriptionQuizModal from './DescriptionQuizModal'
import Snackbar from '@mui/material/Snackbar'
import { Alert,Typography,Breadcrumbs, Link } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import ReviewWindow from './ReviewWindow'
import Loading from '../commonUnit/Loading'
import { SelectedGroupContext } from '../../context/SelectedGroupContext'
import { addToGroup } from '../../service/sessionService'
import { AuthContext } from '../../context/AuthContext'
import { getGroupById } from '../../service/groupService'
import AIChat from '../chat/AIChat'
import PythonInterpreter from '../code/PythonInterpreter'
import { getSchemaBySessionId } from '../../service/codeService'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import {
  getGroupByUser,
  getGroupsByUser
} from '../../service/groupService'
import { CurrencyBitcoin } from '@mui/icons-material'


const StudentPanel = () => {
  const { session } = useContext(SessionContext)
  const { selectedGroup, setSelectedGroup, waiting , setWaiting} = useContext(SelectedGroupContext)
  const { rerender, setRerender, output, setOutput } = useContext(SelectedCodeContext)
  const { currentUser } = useContext(AuthContext)
  const [ currentTable, setCurrentTable] = useState({columns:[],values:[]})
  const [ tables, setTables] = useState({})
  const [ tableName, setTableName] = useState("")


  const resizeEnd = () => {
    if(session.type?.startsWith("Blockly")){
      setRerender({date:Date.now(),width:{left:fileW,middle:window.innerWidth-fileW-pluginW,right:pluginW}})
    }
    console.log(fileW)
    console.log(pluginW)
    console.log(window.innerWidth-fileW-pluginW)
    setRerender({date:Date.now(),width:{left:fileW,middle:window.innerWidth-fileW-pluginW,right:pluginW}})

  }

  const {
    isDragging: isFileDragging,
    position: fileW,
    separatorProps: fileDragBarProps,
  } = useResizable({
    axis: 'x',
    initial: 500,
    min: 0,
    onResizeEnd:resizeEnd,
  })
  const {
    isDragging: isPluginDragging,
    position: pluginW,
    separatorProps: pluginDragBarProps,
  } = useResizable({
    axis: 'x',
    initial: 500,
    min: 0,
    reverse: true,
    onResizeEnd:resizeEnd,
  })
  
  

  const [everOpen, setEverOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [quizEnable, setQuizEnable] = useState(false);

  useEffect(() => {
    console.log(selectedGroup)
    console.log(session)
    console.log(currentUser)
    if (!session) return
    if (session?.grouped && !everOpen) {
      setOpen(true)
      setEverOpen(true)
      if(selectedGroup==null&&currentUser.group_id==null){
        getGroupByUser(currentUser.id,session.id).then((group)=>{
          console.log(group)
          if(group){
            setSelectedGroup(group)
          }
          else if(!session.type.startsWith("SQL") && session.type!="Helper/Helpee"){
            addToGroup(session,currentUser.id).then((res)=>{
              getGroupById(res).then((group)=>{
                console.log(group)
                setSelectedGroup(group)
              })
            })
          }
        })
        
      }
    }
  }, [session, everOpen, currentUser])


  useEffect(() => {
    // //console.log(session)
    if(!session){
      return
    }
    if (!session.grouped) {
      setSelectedGroup(null)
    }
    let me = session?.identity_list?.find(
      (element) => element.id === currentUser.id
    )
    if (me === undefined && waiting) {
      setWaiting(false)
    } else if (me != null && !waiting) {
      setWaiting(true)
    }
  }, [session])

  const fetchGroups = async () => {
    if(!session){
      return
    }
    if(currentUser.role<3) return
    let groups = await getGroupsByUser(currentUser.id,session.id)
    console.log(groups)
    if(groups){
      //showToast("Entered Group","success")
      setSelectedGroup(groups[groups?.length-1])
    }
  }

  useEffect(() => {
    if (waiting) {
      //console.log("Start waiting")
    } else {
      //console.log("entered group")
      fetchGroups()
    }
  }, [waiting])

  useEffect(() => {
    if (!session) return
    const enableQuiz = async() => { 
      setQuizEnable(session?.enable_quiz)
    }
    enableQuiz()
    if(session.type.startsWith("SQL")){
      getSchemaBySessionId(session.id).then((schema)=>{
        console.log(schema)
        let companydb = {tables:schema.data[0]}
        for(let i = 0;i<schema.data[0].values.length;i++){
          companydb[schema.data[0].values[i]]=schema.data[i+1]
        }
        console.log(companydb)
        setCurrentTable(schema.data[0])
        setTables(companydb)
      })
    }
  }, [session])
  
 
  if (!session ) return <Loading />


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <div
      className={
        'div-height flex flex-column h-screen bg-dark font-mono color-white max-screen-width'
      }>
      {session?.grouped && !session.enable_chat && <ReviewWindow />}
      {quizEnable && <DescriptionQuizModal/>}
      <PeerInstruction />
      <div className={'flex grow'}>
        <div
          className={cn('shrink-0 contents', isFileDragging && 'dragging')}
          style={{ width: fileW }}>
          <TaskCard />
          {session.type.startsWith("SQL") &&(
            <div className="taskCard" style={{border: "1px solid #e1e1e1", height: "100%", width: "100%", display: "flex",overflowX:"visible", overflowY:"auto",backgroundColor: "#ffffff", flexDirection: "column", justifyContent: "flex-start",alignItems: "flex-start"}}>
            <Breadcrumbs aria-label="breadcrumb" separator=">">
              <Link variant="hover" sx={{padding:"10px", cursor:'pointer'}} onClick={()=>{
                setCurrentTable(tables["tables"])
                setTableName([])
              }}>Companydb</Link>
              {tableName!="" &&(
                <Link variant="hover" sx={{padding:"10px", cursor:'pointer'}}>{tableName}</Link>
              )}
            </Breadcrumbs>
            <table>
              <thead>
                <tr>
                  {currentTable.columns.map((columnName, i) => (
                    <td key={i}>{columnName}</td>
                  ))}
                </tr>
              </thead>

              <tbody>
                {
                  // values is an array of arrays representing the results of the query
                  currentTable.values.map((row, i) => (
                    <tr key={i}
                    onClick={()=>{
                      if(tables[row[0]]!=null){
                        console.log(currentTable)
                        console.log(row)
                        console.log(tables[row[0]])
                        setCurrentTable(tables[row[0]])
                        setTableName(row[0])
                      }
                    }}>
                      {row.map((value, i) => {
                        if(tables[row[0]]!=null){
                          return (
                            <td key={i}>{<Link sx={{cursor:'pointer'}}>{value}</Link>}</td>
                          )
                        }
                        else{
                          return (
                            <td key={i}>{value}</td>
                          )
                        }
                      })}
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <Typography variant="h6" sx={{ fontWeight: 'light' }}>
              Output
            </Typography>
            <PythonInterpreter output={output} />
          </div>
          )}
          {!session.type.startsWith("SQL") &&(
            <TestList />
          )}
        </div>
        <SampleSplitter isDragging={isFileDragging} {...fileDragBarProps} />
        {session.type === 'Vizmental' ? (<div className = {'flex grow'}>
        <div className={'grow contents'}>
          <CodeStu />
          </div>
          <SampleSplitter
            isDragging={isPluginDragging}
            {...pluginDragBarProps}
          />
          <div
            className={cn('shrink-0 bg-darker contents-chat', isPluginDragging && 'dragging')}
            style={{ width: pluginW }}>            
            <>
              <SubmissionsProvider>
                {session.grouped && <GroupPassRate />}
              </SubmissionsProvider>
              <AIChat />
            </>
          </div>
        </div>) : (
        <div className={'flex grow'}>
          <div
            className={cn('grow contents', isPluginDragging && 'dragging')}
            style={{ width: window.innerWidth - pluginW -fileW-10 }}>
            <CodeStu />
          </div>
          {(!session.type.startsWith("SQL") || selectedGroup ) && (
            <>
              <SampleSplitter
                isDragging={isPluginDragging}
                {...pluginDragBarProps}
              />
              <div className={'shrink-0 bg-darker contents-chat'}
              style={{ width: pluginW}}>
                <>
                  <SubmissionsProvider>
                    {session.grouped && <GroupPassRate />}
                  </SubmissionsProvider>
                  <Chat />
                </>
              </div>
              
            </>
          )}
          
          
        </div>)
        }
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        onClose={handleClose}>
        <Alert severity="info" style={{ fontSize: '2ß0px' }}>
          You are now in a group. Please discuss with your group members
          regarding issues you have during the Individual Attempt.
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        </Alert>
      </Snackbar>
    </div>
  )
}
export default StudentPanel
