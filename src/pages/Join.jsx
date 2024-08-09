import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { addUserToSession, checkUserInSession } from '../service/sessionService'
import { showToast } from '../component/commonUnit/Toast'
import { setSessionInUser } from '../service/userService'
import Home from './Home'
import "../css/login.scss"
import { generateName } from '../tool/nameGenerator'
import { addStu, addStuToSession, getStuById,registerStudent } from '../service/studentService'
import Cookies from 'js-cookie'
import Loading from '../component/commonUnit/Loading'
import { Button } from "@mui/material"
import { getUserByEmail, updateUser } from "../service/userService"
import { IncrementStuNumInSession } from "../service/sessionService"
import { signInWithEmailAndPassword, validateToken, sendRecoveryEmail } from '../service/authService'

const Join = () => {
  const { id } = useParams()
  const [err, setErr] = useState(false)
  const { currentUser, setCurrentUser } = useContext(AuthContext)
  const [dismiss, setDismiss] = useState(false)
  const [mode, setMode] = useState(0)

  useEffect(() => {
    const fetchUserData = async () => {
      let userId = Cookies.get('VisPI_userId')
      console.log(userId)
      if (!userId || userId === "undefined") {
        if(dismiss){
          await generateUser()
          return
        }
      }
      else {
        await getStuById(userId).then(async (res) => {
          console.log(res)
          console.log(id)
          console.log(res.session_id)
          if (res && res.session_id == id) {
            setCurrentUser(res)
          } else if(res) {
            res.group_id = null
            res.code_id = null
            if(res.session_list!=null && !res.session_list?.includes(id)){
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
    const newUser = await addStu(user)
    console.log(newUser)
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
    const password = e.target[1].value
    console.log(email)
    if(e.target[3].checked){
      let result = await sendRecoveryEmail(email)
      console.log(result)

    }
    else{
      try {
        let token = await signInWithEmailAndPassword(email, password)
        console.log(token)
        let user = await validateToken(token)
        console.log(user)
        if (user) {
          console.log(id)
          console.log(user.session_id)
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
        let stu = await getUserByEmail(email)
        if(stu != null){
          setErr("Incorrect Password")
        }
        else{
          setErr("Account with this email does not exist")
        }
        console.log(err)
        if (err.response?.status === 500) {
          console.log(err.response)
        } else {
        }
        console.error(err)
      }
    }
    
  }


  const handleRegister = async (e) => {
    e.preventDefault()
    const email = e.target[0].value
    const password = e.target[1].value
    const password2 = e.target[2].value
    console.log(email)
    console.log(password)
    console.log(password2)
    if(password === password2){
      if(password.length<6){
        setErr("Password should be at least 6 characters")
        return
      }
      try {
        const fakeName = generateName()
          let user = {
            first_name: fakeName,
            middle_name: '',
            session_id: id,
            email: email,
            password: password,
            session_list:[id]
          }
          const newUser = await registerStudent(user)
          console.log(newUser)
          if (newUser != null && newUser != "Account with this email already exists") {
            Cookies.set('VisPI_userId', newUser.id)
            setCurrentUser(newUser)
            window.location.href = '/session/' + id
          } else {
            setErr(newUser)
            showToast('Fail to join session', 'error')
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
    else{
      setErr("Passwords don't match")
    }
    
  }

  return currentUser ? <Home /> : (
    <div>
      { mode === 0 && (
        <div className="formContainer">
          <div className="formWrapper">
            <span className="logo">VizPI</span>
            <Button 
            fullWidth 
            variant="contained" 
            sx={{fontSize:".8em",borderRadius:"20px",backgroundColor:"#e0e0e0",color:"#333",boxShadow:"-4px -4px 8px #c6c6c6, 4px 4px 8px #ffffff",'&:hover': {boxShadow: "-2px -2px 4px #c6c6c6, 2px 2px 4px #ffffff", backgroundColor:"#e0e0e0"},}}
            onClick={()=>setMode(1)}
            >Create Account</Button>
            <Button 
            fullWidth 
            variant="contained" 
            sx={{fontSize:".8em",borderRadius:"20px",backgroundColor:"#e0e0e0",color:"#333",boxShadow:"-4px -4px 8px #c6c6c6, 4px 4px 8px #ffffff",'&:hover': {boxShadow: "-2px -2px 4px #c6c6c6, 2px 2px 4px #ffffff", backgroundColor:"#e0e0e0"},}}
            onClick={()=>setMode(2)}
            >Sign In</Button>
            <Button 
            fullWidth 
            variant="contained" 
            sx={{fontSize:".8em",borderRadius:"20px",backgroundColor:"#e0e0e0",color:"#333",boxShadow:"-4px -4px 8px #c6c6c6, 4px 4px 8px #ffffff",'&:hover': {boxShadow: "-2px -2px 4px #c6c6c6, 2px 2px 4px #ffffff", backgroundColor:"#e0e0e0"},}}
            onClick={()=>setDismiss(true)}
            >Continue as Guest</Button>
          </div>
        </div>
      )}
      {mode === 1 && (
        <div className="formContainer">
        <div className="formWrapper">
          <span className="logo">VizPI</span>
          <form onSubmit={handleRegister}>
            <input type="email" placeholder="email" />
            <input type="password" placeholder="password" />
            <input type="password" placeholder="re-type password" />
            <button>Create Account</button>
            {err && <span>{err}</span>}
          </form>
        </div>
      </div>
      )} 
      {mode === 2 && (
        <div className="formContainer">
        <div className="formWrapper">
          <span className="logo">VizPI</span>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="email" />
            <input type="password" placeholder="password" />
            <button>Sign In</button>
            <div style={{display:"flex"}}>
              <input style={{width:"16px", height:"16px"}}type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
              <label for="vehicle1">Send password recovery to my email</label>
            </div>
            {err && <span>{err}</span>}
          </form>
        </div>
      </div>
      )} 
    </div>
    
    
  )
}

export default Join
