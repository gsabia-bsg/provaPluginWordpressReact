import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const rootId = window.__WAL_ROOT_ID__ || 'root'
createRoot(document.getElementById(rootId)).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
