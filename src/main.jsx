import { BrowserRouter as Router, Route, Routes, Navigate, createBrowserRouter} from 'react-router-dom';
import Login from './Components/Login/Login.jsx';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  } ,
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
