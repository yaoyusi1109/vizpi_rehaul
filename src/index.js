import React from "react"
import ReactDOM from "react-dom/client"
// import './index.css';
import App from "./App"
import { AuthContextProvider } from "./context/AuthContext"
import { ProgressContextProvider } from "./context/ProgressContext"
import { SelectedCodeProvider } from "./context/SelectedCodeContext"
import { SelectedGroupProvider } from "./context/SelectedGroupContext"
import { SelectedUsersProvider } from "./context/SelectedUserContext"
import reportWebVitals from "./reportWebVitals"
import { SessionProvider } from "./context/SessionContext"
import { ModeContextProvider } from "./context/ModeContext"
import { FunctionNameContextProvider } from "./context/FunctionName"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <AuthContextProvider>
    <SessionProvider>
      <SelectedGroupProvider>
        <ProgressContextProvider>
          <SelectedUsersProvider>
            <SelectedCodeProvider>
              {/* <React.StrictMode> */}
              <ModeContextProvider>
                <FunctionNameContextProvider>
                  <App />
                </FunctionNameContextProvider>
              </ModeContextProvider >
              {/* </React.StrictMode > */}
            </SelectedCodeProvider >
          </SelectedUsersProvider >
        </ProgressContextProvider >
      </SelectedGroupProvider >
    </SessionProvider >
  </AuthContextProvider >
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(//console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
