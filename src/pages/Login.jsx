import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from '../service/authService'
import { AuthContext } from '../context/AuthContext'
import Cookies from 'js-cookie'
import { CachedOutlined }from '@mui/icons-material'

const Login = () => {
  const [err, setErr] = useState(false)
  const navigate = useNavigate()
  const { currentUser, setCurrentUser } = useContext(AuthContext)
  const [isLogin, setIsLogin] = useState(false)
  const handleHomePage = () => {
    navigate('/about')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target[0].value
    const password = e.target[1].value

    try {
      await signInWithEmailAndPassword(email, password)
      navigate('/')
    } catch (err) {
      console.log(err)
      if (err.response?.status === 500) {
        console.log(err.response)
        setErr('Invalid email or password')
      } else {
        setErr('Something went wrong')
      }
      console.error(err)
    }
  }

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">VizPI</span>
        <form onSubmit={handleSubmit} className='loginForm'>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <div className='loginButton'><button>Sign in</button></div>
          <div className='loginButton'>
            <button disabled={isLogin}>{isLogin ?
              <div className='spinContainer'>
                <CachedOutlined className='spin'/> 
                be logging in
              </div>
              : 'Sign in'}
            </button>
          </div>
          <button onClick={handleHomePage}>
          Homepage
          </button>
          {err && <span>{err}</span>}
        </form>
      </div>
    </div>
  )
}

export default Login
