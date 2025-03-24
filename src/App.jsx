import React from 'react'
import styled from 'styled-components'
import Sidebar from './components/Sidebar/Sidebar'
import Dashboard from './components/Dashboard/Dashboard'
import './App.css'

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

function App() {
  return (
    <AppContainer>
      <Sidebar />
      <Dashboard />
    </AppContainer>
  )
}

export default App