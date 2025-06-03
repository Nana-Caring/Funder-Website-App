import React, { Suspense, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import './App.css'

const MainContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  padding: 20px;
  padding-left: 40px; /* Increased left padding to move content away from sidebar */
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
  box-sizing: border-box;
`;

const AppContainer = styled.div`
  display: flex;
  height: 100vh; /* Changed to viewport height */
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const DashboardLayout = () => {
  const { loading } = useSelector(state => state.authentication);
  const location = useLocation();

  // Get user from Redux store
const { user } = useSelector(state => state.authentication);

// Determine welcome message and title based on path
let headerTitle = `Welcome back, ${user?.name || 'User'}`;
if (location.pathname.startsWith('/my-accounts')) headerTitle = 'Welcome to My Accounts';
else if (location.pathname.startsWith('/send-money')) headerTitle = 'Welcome to Send Money';
else if (location.pathname.startsWith('/beneficiary')) headerTitle = 'Welcome to Beneficiary';
else if (location.pathname.startsWith('/messages')) headerTitle = 'Welcome to Messages';
else if (location.pathname.startsWith('/statements')) headerTitle = 'Welcome to Statements';

  return (
    <AppContainer>
      {loading && <Loader />}
      <Sidebar style={{ zIndex: 100 }} />
      <MainContentWrapper>
        <Header title={headerTitle} />
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
      </MainContentWrapper>
    </AppContainer>
  );
};

const DependentLayout = ({ children }) => {
  const { loading } = useSelector(state => state.authentication);
  const { user } = useSelector(state => state.authentication);

  return (
    <AppContainer>
      {loading && <Loader />}
      <DependentSidebar style={{ zIndex: 100 }}/>
      <MainContentWrapper>
        <Header>
          <div style={{ fontSize: '18px', color: '#333' }}>
            Welcome back, <span style={{ fontWeight: 'bold' }}>{user?.name || 'User'}</span>
          </div>
        </Header>
        <Suspense fallback={<Loader />}>
          {children}
        </Suspense>
      </MainContentWrapper>
    </AppContainer>
  );
};

const CareGiverLayout = ({ children }) => {
  const { loading } = useSelector(state => state.authentication);
  const { user } = useSelector(state => state.authentication);

  return (
    <AppContainer>
      {loading && <Loader />}
      <CareGiverSidebar style={{ zIndex: 100 }}/>
      <MainContentWrapper>
        <Header isCareGiver={true}>
          <div style={{ fontSize: '18px', color: '#333' }}>
            Welcome back, <span style={{ fontWeight: 'bold' }}>{user?.name || 'Caregiver'}</span>
          </div>
        </Header>
        <Suspense fallback={<Loader />}>
          {children}
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
      <Route path="/" element={<Navigate to="/caregiver-home" />} />
      <Route 
        path="/caregiver-home" 
        element={<CareGiverLayout><CareGiverHome /></CareGiverLayout>}
      />
      <Route 
        path="/caregiver-beneficiary" 
        element={<CareGiverLayout><CareGiverBeneficiary /></CareGiverLayout>}
      />
      <Route 
        path="/caregiver-expenses" 
        element={<CareGiverLayout><CareGiverExpenses /></CareGiverLayout>}
      />
      <Route 
        path="/caregiver-requests" 
        element={<CareGiverLayout><CareGiverRequests /></CareGiverLayout>}
      />
      <Route 
        path="/caregiver-statements" 
        element={<CareGiverLayout><CareGiverStatements /></CareGiverLayout>}
      />
      <Route path="*" element={<Navigate to="/caregiver-home" />} />
    </Routes>
  );

  // Dependent Routes
  const dependentRoutes = (
    <Routes>
      <Route path="/" element={<Navigate to="/dependent-home" />} />
      <Route 
        path="/dependent-home" 
        element={<DependentLayout><DependentHome /></DependentLayout>}
      />
      <Route 
        path="/dependent-buy" 
        element={<DependentLayout><DependentBuy /></DependentLayout>}
      />
      <Route 
        path="/dependent-myaccounts" 
        element={<DependentLayout><DependentMyAccounts /></DependentLayout>}
      />
      <Route 
        path="/dependent-transfer" 
        element={<DependentLayout><DependentTransfer /></DependentLayout>}
      />
      <Route 
        path="/dependent-statements" 
        element={<DependentLayout><DependentStatements /></DependentLayout>}
      />
      <Route path="*" element={<Navigate to="/dependent-home" />} />
    </Routes>
  );

  // Public Routes
  const publicRoutes = (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/second-signup" element={<SecondSignUp />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/benefits" element={<Benefits />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );

  const renderRoutes = () => {
    if (!isAuthenticated) return publicRoutes;
    
    switch (user?.role) {
      case 'caregiver':
        return caregiverRoutes;
      case 'dependent':
        return dependentRoutes;
      case 'funder':
        return (
          <Routes>
            <Route path="/*" element={<DashboardLayout />} />
          </Routes>
        );
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
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