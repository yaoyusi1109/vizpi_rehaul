import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { addUserToSession, checkUserInSession } from '../service/sessionService'
import { showToast } from '../component/commonUnit/Toast'
import { setSessionInUser } from '../service/userService'
import Home from './Home'
import "../css/login.scss"
import { generateName } from '../tool/nameGenerator'
import { addStu, addStuToSession, getStuById } from '../service/studentService'
import Cookies from 'js-cookie'
import Loading from '../component/commonUnit/Loading'
import { Button } from "@mui/material"
import { getUserByEmail, updateUser } from "../service/userService"
import { IncrementStuNumInSession } from "../service/sessionService"

const Join = () => {
  const { id } = useParams()
  const { currentUser, setCurrentUser } = useContext(AuthContext)
  const [dismiss, setDismiss] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      let userId = Cookies.get('VisPI_userId')
      if (!userId) {
        if(dismiss){
          await generateUser()
          return
        }
      } else {
        await getStuById(userId).then(async (res) => {
          console.log(res)
          if (res && res.session_id == id) {
            setCurrentUser(res)
          } else if(res) {
            res.group_id = null
            res.code_id = null
            if(!res.session_list.includes(id)){
              res.session_list.push(id)
              await IncrementStuNumInSession(id)
            }
            res.session_id = id
            
            await updateUser(res)
            setCurrentUser(res)
          }
          else{
            await generateUser()
          }
        })
      }

      // window.location.href = '/'
    }

    fetchUserData()
  }, [dismiss])

  const generateUser = async () => {
    const fakeName = generateName()
    let user = {
      first_name: fakeName,
      middle_name: '',
      session_id: id,
    }
    const newUser = await addStu(id, user)
    if (newUser !== null) {
      Cookies.set('VisPI_userId', newUser.id)
      setCurrentUser(newUser)
      window.location.href = '/session/' + id
    } else {
      showToast('Fail to join session', 'error')
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target[0].value
    console.log(email)

    try {
      let user = await getUserByEmail(email)
      console.log(user)
      if(user == null|| user == ""){
        const fakeName = generateName()
        let user = {
          first_name: fakeName,
          middle_name: '',
          session_id: id,
          email: email,
          session_list:[id]
        }
        const newUser = await addStu(id, user)
        if (newUser !== null) {
          Cookies.set('VisPI_userId', newUser.id)
          setCurrentUser(newUser)
          window.location.href = '/session/' + id
        } else {
          showToast('Fail to join session', 'error')
        }
      }
      else{
        console.log(id)
        if(user.session_id != id){
          user.group_id = null
          user.code_id = null
          if(!user.session_list.includes(id)){
            user.session_list.push(id)
            await IncrementStuNumInSession(id)
          }
          user.session_id = id
          
          await updateUser(user)
          
        }
        Cookies.set('VisPI_userId', user.id)
        setCurrentUser(user)
        window.location.href = '/session/' + id
      }

    } catch (err) {
      console.log(err)
      if (err.response?.status === 500) {
        console.log(err.response)
      } else {
      }
      console.error(err)
    }
  }

  return currentUser ? <Home /> : (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">VizPI</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <button>Sign In</button>
        </form>
        <Button 
        fullWidth 
        variant="contained" 
        sx={{fontSize:".8em",borderRadius:"20px",backgroundColor:"#e0e0e0",color:"#333",boxShadow:"-4px -4px 8px #c6c6c6, 4px 4px 8px #ffffff",'&:hover': {boxShadow: "-2px -2px 4px #c6c6c6, 2px 2px 4px #ffffff", backgroundColor:"#e0e0e0"},}}
        onClick={()=>setDismiss(true)}
        >Continue as Guest</Button>
      </div>
    </div>
  )
}

export default Join
