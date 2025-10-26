import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Dashboard from './components/Dashboard/Dashboard';
import MyCards from './components/MyAccounts/MyCardsWrapper';
import SendMoney from './components/SendMoney/SendMoney';
import BeneficiaryForm from './components/Beneficiary/Beneficiary';
import Messages from './components/Messages/Messages';
import Statements from './components/Statements/Statements';
import LandingPage from './components/LandingPage/LandingPage';
import SignUpPage from './components/SignUpPage/SignUpPage';
import LoginPage from './components/LoginPage/LoginPage';
import ResetPassword from './components/ResetPassword/ResetPassword';
import SecondSignUp from './components/SignUpPage/SecondSignUp';
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
import DependentMyAccounts from './components/DependentMyAccounts/DependentMyAccounts';
import CareGiverExpenses from './components/CareGiverExpenses';
import Profile from './components/Profile/Profile';
import Settings from './components/Settings/Settings';
import Notifications from './components/Notifications/Notifications';
import DependentSettings from './components/Settings/DependentSettings';
import CaregiverSettings from './components/Settings/CaregiverSettings';
import FunderSettings from './components/Settings/FunderSettings';
import DependentProfile from './components/Profile/DependentProfile';
import CaregiverProfile from './components/Profile/CaregiverProfile';
import FunderProfile from './components/Profile/FunderProfile';

export const router = createBrowserRouter([
  {
    path: '/*',
    element: <App />,
  }
], {
  future: {
    v7_relativeSplatPath: true
  }
});
