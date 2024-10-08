import axios from 'axios'
import Cookies from 'js-cookie'
const url = process.env.REACT_APP_HOST_API

export const signInWithEmailAndPassword = async (email, password) => {
  const instructor = {
    email: email,
    password: password
  }
  let token
  try {
    let res = await axios.post(url + '/login', instructor)
    token = res.data.token
    Cookies.set('VizPI_token', token, { expires: 7 })
  } catch (e) {
    console.error(e)
    throw e
  }
  // await axios.post(url + '/login', instructor).then((response) => {
  //   token = response.data.token
  //   Cookies.set('VizPI_token', token, { expires: 7 })
  // }).catch((error) => {
  //   console.log(error)
  //   throw error
  // })
  return token
}

export const validateToken = async (token) => {
  let instructor
  await axios.post(url + '/validate', {
    token: token
  }).then((response) => {
    instructor = response.data
    if(instructor.role == 1){
      instructor.session_id = instructor.current_session
    }
  }).catch((error) => {
    throw error
  })
  return instructor
}

export const sendRecoveryEmail = async (email) => {
  if (!email) {
    //console.log("can't update")
    return false
  }
  console.log({
    email: email,
  })
  try {
    let res = await axios.post(process.env.REACT_APP_HOST_API + '/recover', {
      email: email,
    })
    console.log(res)
    return res
  }
  catch (err) {
    //console.log(err)
    return err
  }
}

export const signOut = async () => {
  Cookies.remove('VizPI_token')
  Cookies.remove('VisPI_userId')
  return true
}
