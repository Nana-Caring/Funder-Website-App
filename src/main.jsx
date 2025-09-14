import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { store } from './store/store'
import { router } from './router'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider 
        router={router} 
        future={{ 
          v7_startTransition: true,
          v7_relativeSplatPath: true 
        }} 
      />
    </Provider>
  </React.StrictMode>
)
