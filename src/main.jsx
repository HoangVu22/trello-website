// import React from 'react'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline' // giúp nhất quán, đồng bộ giữa các trình duyệt (MUI)
import App from './App.jsx'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
// import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'

// Cấu hình React-Toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Cấu hình Mui Dialog
import { ConfirmProvider } from 'material-ui-confirm'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <CssVarsProvider theme={theme}>
    <ConfirmProvider defaultOptions={{
      // dialogProps: { maxWidth: 'lg' }
      allowClose: false,
      cancellationButtonProps: { color: 'inherit' },
      confirmationButtonProps: { color: 'error', variant: 'outlined' }
    }}>
      <CssBaseline />
      <App />
      <ToastContainer />
    </ConfirmProvider>
  </CssVarsProvider>
  // </React.StrictMode>,
)
