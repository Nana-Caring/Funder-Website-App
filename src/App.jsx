import React, { Suspense, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Loader from './components/Loader/Loader';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
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
import SecondSignUp from './components/SignUpPage/SecondSignUp'
import SplashScreen from './components/SplashScreen/SplashScreen';
import Benefits from './components/BenefitsPage/Benefits';
import HowItWorksPage from './components/HowItWorks/HowItWorks';
import Contact from './components/ContactPage/Contact';
import './App.css'

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const DashboardLayout = () => {
  const { loading } = useSelector(state => state.authentication);

  return (
    <AppContainer>
      {loading && <Loader />}
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header title="Dashboard" />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-accounts" 
              element={
                <ProtectedRoute>
                  <MyAccounts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/send-money" 
              element={
                <ProtectedRoute>
                  <SendMoney />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/beneficiary" 
              element={
                <ProtectedRoute>
                  <BeneficiaryForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/statements" 
              element={
                <ProtectedRoute>
                  <Statements />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </div>
    </AppContainer>
  );
};

function App() {
  const { loading } = useSelector(state => state.authentication);
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      {!showSplash && (
        <>
          {loading && <Loader />}
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/second-signup" element={<SecondSignUp />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/benefits" element={<Benefits />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route 
                path="/*" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Suspense>
        </>
      )}
    </>
  );
}

export default App;