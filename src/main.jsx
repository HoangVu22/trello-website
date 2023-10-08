import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline' // giúp nhất quán, đồng bộ giữa các trình duyệt (MUI)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>,
)
