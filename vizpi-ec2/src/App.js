import Home from "./pages/Home"
import Login from "./pages/Login"
import About from "./pages/About"
import "./css/home.scss"
import "./css/login.scss"
import "./css/session.scss"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"
import Join from "./pages/Join"
import Cookies from "js-cookie"
import { validateToken } from "./service/authService"

function App () {
  const { currentUser, setCurrentUser } = useContext(AuthContext)

  const ProtectedRoute = async ({ children }) => {
    if (!currentUser) {
      if (Cookies.get('VizPI_token')) {
        const token = Cookies.get('VizPI_token')
        await validateToken(token).then((user) => {
          if (user) {
            // //console.log(user)
            setCurrentUser(user)
          }
        }).catch((err) => {
          console.error(err)
          return <Navigate to="/about" />
        })
      } else {
        return <Navigate to="/about" />
      }
    }
    return children
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              // <ProtectedRoute>
              <Home />
              // </ProtectedRoute> 
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="session/:id" element={<Join />} />
          <Route path="about" element={<About />} />
          {/* <Route path="register" element={<Register />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
