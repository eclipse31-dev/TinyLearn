import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import router from './router.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

const root = createRoot(document.getElementById('root'))

root.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)
