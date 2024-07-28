import axios from "axios"
const stuUrl = process.env.REACT_APP_HOST_API + '/users'
const sessionUrl = process.env.REACT_APP_HOST_API + '/sessions'

export const addStu = async (sessionId, user) => {
  if (!sessionId || !user) {
    //console.log("can't update")
    return false
  }
  //console.log(user)
  try {
    let res = await axios.post(sessionUrl + '/' + sessionId + '/register', {
      user: user,
    })
    return res.data.user
  }
  catch (err) {
    //console.log(err)
    return null
  }
}

export const getStuById = async (id) => {
  if (!id)
    return null
  let user
  await axios.get(stuUrl + '/' + id)
    .then(response => {
      user = response.data
      user.role = 3
    })
    .catch(error => {
      throw error
    })
  return user
}
