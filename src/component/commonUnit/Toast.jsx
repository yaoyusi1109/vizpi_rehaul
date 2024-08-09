import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const showToast = (message, type = 'info', duration = 3000) => {
  switch (type) {
    case 'success':
      toast.success(message, { autoClose: duration })
      break
    case 'error':
      toast.error(message, { autoClose: duration })
      break
    case 'warning':
      toast.warn(message, { autoClose: duration })
      break
    default:
      toast.info(message, { autoClose: duration })
      break
  }
}

export const Toast = () => {
  return <ToastContainer />
}
