import React from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'
import Dashboard from './components/Dashboard/Dashboard'
import MyAccounts from './components/MyAccounts/MyAccounts'
import SendMoney from './components/SendMoney/SendMoney'
import BeneficiaryForm from './components/Beneficiary/Beneficiary'
import Messages from './components/Messages/Messages'
import Statements from './components/Statements/Statements'
import LandingPage from './components/LandingPage/LandingPage'
import SignUpPage from './components/SignUpPage/SignUpPage'
import LoginPage from './components/LoginPage/LoginPage'
import './App.css'

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const DashboardLayout = () => (
  <AppContainer>
    <Sidebar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Header title="Dashboard" />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-accounts" element={<MyAccounts />} />
        <Route path="/send-money" element={<SendMoney />} />
        <Route path="/beneficiary" element={<BeneficiaryForm />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/statements" element={<Statements />} />
      </Routes>
    </div>
  </AppContainer>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<DashboardLayout />} />
      </Routes>
    </Router>
  )
}

export default App