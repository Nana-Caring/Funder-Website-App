import React, { Suspense, useState } from 'react';
import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Loader from './components/Loader/Loader';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'
import Dashboard from './components/Dashboard/Dashboard'
import MyAccounts from './components/MyAccounts/MyAccounts';
import SendMoney from './components/SendMoney/SendMoney'
import BeneficiaryForm from './components/Beneficiary/Beneficiary'
import Messages from './components/Messages/Messages'
import Statements from './components/Statements/Statements'
import LandingPage from './components/LandingPage/LandingPage'
import SignUpPage from './components/SignUpPage/SignUpPage'
import LoginPage from './components/LoginPage/LoginPage'
import ResetPassword from './components/ResetPassword/ResetPassword'
import SecondSignUp from './components/SignUpPage/SecondSignUp'
import SplashScreen from './components/SplashScreen/SplashScreen';
import Benefits from './components/BenefitsPage/Benefits';
import HowItWorks from './components/HowItWorksPage/HowItWorks';
import Contact from './components/ContactPage/Contact';
import DependentHome from './components/DependentHome/DependentHome';
import DependentTransfer from './components/DependentTransfer/DependentTransfer';
import DependentBuy from './components/DependentBuy/DependentBuy';
import DependentStatements from './components/DependentStatements/DependentStatements';
import CareGiverStatements from './components/CareGiverStatements/CareGiverStatements';
import CareGiverRequests from './components/CareGiverRequests/CareGiverRequests';
import CareGiverHome from './components/CareGiverHome';
import CareGiverBeneficiary from './components/CareGiverBeneficiary/CareGiverBeneficiary';
import DependentSidebar from './components/DependentSidebar/DependentSidebar';
import DependentMyAccounts from './components/DependentMyAccounts/DependentMyAccounts';
import CareGiverSidebar from './components/CareGiverSidebar/CareGiverSidebar';
import CareGiverExpenses from './components/CareGiverExpenses';
import Profile from './components/Profile/Profile';
import Settings from './components/Settings/Settings';
import Notifications from './components/Notifications/Notifications';
import './App.css'
import CaregiverHeader from './components/Header/CaregiverHeader';
import DependentHeader from './components/Header/DependentHeader';
import FunderHeader from './components/Header/FunderHeader';
import DependentSettings from './components/Settings/DependentSettings';
import CaregiverSettings from './components/Settings/CaregiverSettings';
import FunderSettings from './components/Settings/FunderSettings';
import DependentProfile from './components/Profile/DependentProfile';
import CaregiverProfile from './components/Profile/CaregiverProfile';
import FunderProfile from './components/Profile/FunderProfile';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51REGFbROeQRel9O58mOSulLZR25JiDCo0FqwlrhopxEUuFh68lZXNTKYDer8334RrTFGBvlsKdkPMFbvzLbaoA4X00OLIDpVtW');

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const MainContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  padding: 20px;
  padding-left: 40px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  padding: 80px 24px 24px;
  min-height: calc(100vh - 80px);
  box-sizing: border-box;
`;

const CareGiverLayout = () => {
  return (
    <AppContainer>
      <CareGiverSidebar />
      <MainContentWrapper>
        <CaregiverHeader />
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </MainContentWrapper>
    </AppContainer>
  );
};

const DependentLayout = () => {
  const { loading } = useSelector(state => state.authentication);

  return (
    <AppContainer>
      <DependentSidebar />
      <MainContentWrapper>
        <DependentHeader />
        <ContentWrapper>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </ContentWrapper>
      </MainContentWrapper>
    </AppContainer>
  );
};

const DashboardLayout = () => {
  return (
    <AppContainer>
      <Sidebar />
      <MainContentWrapper>
        <FunderHeader />
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </MainContentWrapper>
    </AppContainer>
  );
};

function App() {
  const { loading, user, isAuthenticated } = useSelector(state => state.authentication);
  const [showSplash, setShowSplash] = useState(true);

  // Caregiver Routes
  const caregiverRoutes = (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['caregiver']}>
          <CareGiverLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/caregiver-home" replace />} />
        <Route path="caregiver-home" element={<CareGiverHome />} />
        <Route path="caregiver-beneficiary" element={<CareGiverBeneficiary />} />
        <Route path="caregiver-expenses" element={<CareGiverExpenses />} />
        <Route path="caregiver-requests" element={<CareGiverRequests />} />
        <Route path="caregiver-statements" element={<CareGiverStatements />} />
        <Route path="profile" element={<CaregiverProfile />} />
        <Route path="settings" element={<CaregiverSettings />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="*" element={<Navigate to="/caregiver-home" replace />} />
      </Route>
    </Routes>
  );

  // Dependent Routes
  const dependentRoutes = (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['dependent']}>
          <DependentLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dependent-home" replace />} />
        <Route path="dependent-home" element={<DependentHome />} />
        <Route path="dependent-buy" element={<DependentBuy />} />
        <Route path="dependent-myaccounts" element={<DependentMyAccounts />} />
        <Route path="dependent-transfer" element={<DependentTransfer />} />
        <Route path="dependent-statements" element={<DependentStatements />} />
        <Route path="profile" element={<DependentProfile />} />
        <Route path="settings" element={<DependentSettings />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="*" element={<Navigate to="/dependent-home" replace />} />
      </Route>
    </Routes>
  );

  // Public Routes
  const publicRoutes = (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/second-signup" element={<SecondSignUp />} />
      <Route path="/login" element={<LoginPage />} />
  <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/benefits" element={<Benefits />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );

  // Update the renderRoutes function
  const renderRoutes = () => {
    if (!isAuthenticated) return publicRoutes;
    
    switch (user?.role) {
      case 'caregiver':
        return (
          <Routes>
            <Route path="/" element={
              <ProtectedRoute allowedRoles={['caregiver']}>
                <CareGiverLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/caregiver-home" replace />} />
              <Route path="caregiver-home" element={<CareGiverHome />} />
              <Route path="caregiver-beneficiary" element={<CareGiverBeneficiary />} />
              <Route path="caregiver-expenses" element={<CareGiverExpenses />} />
              <Route path="caregiver-requests" element={<CareGiverRequests />} />
              <Route path="caregiver-statements" element={<CareGiverStatements />} />
              <Route path="profile" element={<CaregiverProfile />} />
              <Route path="settings" element={<CaregiverSettings />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="*" element={<Navigate to="/caregiver-home" replace />} />
            </Route>
          </Routes>
        );
      case 'dependent':
        return dependentRoutes;
      case 'funder':
        return (
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/*" element={
              <ProtectedRoute allowedRoles={['funder']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="my-accounts" element={
                <Elements stripe={stripePromise}>
                  <MyAccounts />
                </Elements>
                } />
                <Route path="send-money" element={
                  <Elements stripe={stripePromise}>
                    <SendMoney />
                  </Elements>
                } />
              <Route path="beneficiary" element={<BeneficiaryForm />} />
              <Route path="messages" element={<Messages />} />
              <Route path="statements" element={<Statements />} />
              <Route path="profile" element={<FunderProfile />} />
              <Route path="settings" element={<FunderSettings />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Routes>
        );
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <>
      <SplashScreen onFinish={() => setShowSplash(false)} />
      {!showSplash && (
        <>
          {loading && <Loader />}
          <Suspense fallback={<Loader />}>
            {renderRoutes()}
          </Suspense>
        </>
      )}
    </>
  );
}

export default App;