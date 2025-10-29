import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import expensesIcon from '../assets/icons/expenses.png';
import arrowIcon from '../assets/icons/arrow.png';
import ProfileCompletionPopup from './common/ProfileCompletionPopup';
import { 
  initializeBeneficiaries,
  setCurrentUser,
  forceRefresh 
} from '../store/slices/beneficiaries';

// Styled components
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  width: calc(100% - 250px);
  margin-left: auto;
  margin-top: 80px;
  box-sizing: border-box;
  height: calc(100vh - 10px);
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 16px;
  margin-bottom: 16px;
  align-items: start;
  width: 100%;
  justify-content: center; /* Center grid items */
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 16px; /* Reduced padding */
  display: flex;
  flex-direction: column;
  min-height: 240px; /* Reduced height */
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }
`;

const RequestsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 180px; /* Reduced height */
  overflow-y: auto;
`;

const RequestsCard = styled(Card)`
  max-width: 100%;
  margin: 0;
  padding: 16px;
  min-height: 200px; /* Reduced height */
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;


const Avatar = styled.div`
  width: 32px; /* Reduced size */
  height: 32px;
  border-radius: 50%;
  background: #a084ee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  border: 2px solid #fff;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const BarChart = styled.div`
  display: flex;
  height: 20px; /* Reduced height */
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0 12px 0; /* Reduced margins */
  background: #e5e7eb;
`;

const Bar = styled.div`
  height: 100%;
  background: ${props => props.color};
  width: ${props => props.$percent}%;
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 8px;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const DependentToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

const DependentSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background: #e9ecef;
    color: #333;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AccountsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 16px;
  gap: 12px;
`;

const DateSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 8px;
  border: 1px solid #dee2e6;
  position: relative;
`;

const DateDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
`;

const DateText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const DayText = styled.div`
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DateNavButton = styled.button`
  background: none;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
  color: #666;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 16px;
  font-weight: bold;
  
  &:hover {
    background: #dee2e6;
    color: #333;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TodayButton = styled.button`
  background: #185c37;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #1e6b42;
  }
`;

const CalendarPicker = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 12px;
  min-width: 280px;
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 4px;
`;

const MonthYear = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background: #f1f1f1;
    color: #333;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const DayHeader = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #666;
  text-align: center;
  padding: 4px;
  text-transform: uppercase;
`;

const DayCell = styled.button`
  background: ${props => props.isSelected ? '#185c37' : props.isToday ? '#f0f8ff' : 'transparent'};
  color: ${props => props.isSelected ? 'white' : props.isOtherMonth ? '#ccc' : '#333'};
  border: ${props => props.isToday && !props.isSelected ? '1px solid #185c37' : '1px solid transparent'};
  padding: 6px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 12px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.isSelected ? '#1e6b42' : '#f1f1f1'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
`;

const DailyExpenseText = styled.div`
  font-size: 11px;
  color: #666;
  margin-top: 2px;
  font-weight: 500;
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #444;
`;

const Dot = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${props => props.color};
  display: inline-block;
`;

const SectionTitle = styled.div`
  font-size: 16px; /* Reduced font size */
  margin-bottom: 14px; /* Reduced margin */
  color: #222;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SeeAll = styled.span`
  color: #ff4c60;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }
`;

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f7faf7;
  border-radius: 12px;
  padding: 8px 12px;
`;

const TransactionAvatar = styled(Avatar)`
  background: #3b82f6;
  width: 32px;
  height: 32px;
  font-size: 16px;
`;

const TransactionInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const TransactionName = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #222;
`;

const TransactionDate = styled.div`
  font-size: 12px;
  color: #888;
`;

const TransactionAmount = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #222;
  margin-left: auto;
`;

const RequestRow = styled.div`
  display: flex;
  align-items: center;
  background: #f0f0f0;
  border-radius: 20px;
  padding: 12px 12px;
  gap: 8px;
`;

const RequestName = styled.div`
  flex: 2;
  font-size: 15px;
  color: #222;
`;

const RequestReason = styled.div`
  flex: 2;
  font-size: 15px;
  color: #444;
`;

const RequestAmount = styled.div`
  flex: 1;
  font-size: 15px;
  color: #222;
`;

const RequestAction = styled.div`
  flex: 0 0 40px;
  display: flex;
  justify-content: flex-end;
`;

const AvatarsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const DependentName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
`;

const AvatarsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #f1f1f1;
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background: none;
      transform: none;
    }
  }
`;

const DotsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
`;

const DotIndicator = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.active ? 'pink' : '#e0e0e0'};
  display: inline-block;
`;

const ResponsiveWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto; /* Center the wrapper */
  padding: 0 12px;

  @media (max-width: 1200px) {
    ${Grid} {
      grid-template-columns: 1fr;
      max-width: 600px;
      margin: 0 auto; /* Center grid on smaller screens */
    }
  }

  @media (max-width: 768px) {
    padding: 0 8px;
    ${Grid} {
      grid-template-columns: 1fr;
    }
  }
`;

// Update the component return statement
const CareGiverHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [selectedDependentIndex, setSelectedDependentIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());

  // Date navigation handlers
  const goToPreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(previousDay.getDate() - 1);
    setSelectedDate(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Navigate to next dependent
  const goToNextDependent = () => {
    if (dependents.length > 0) {
      setSelectedDependentIndex((prevIndex) => 
        prevIndex >= dependents.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  // Check if selected date is today
  const isToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  // Format date for display
  const formatDate = (date) => {
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Calendar picker functions
  const toggleCalendarPicker = () => {
    setShowCalendarPicker(!showCalendarPicker);
    setCalendarViewDate(selectedDate);
  };

  const goToPreviousMonth = () => {
    const prevMonth = new Date(calendarViewDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCalendarViewDate(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(calendarViewDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCalendarViewDate(nextMonth);
  };

  const selectDate = (date) => {
    setSelectedDate(date);
    setShowCalendarPicker(false);
  };

  const generateCalendarDays = () => {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, 1 - (firstDayOfWeek - i));
      days.push({
        date: prevMonthDay,
        isOtherMonth: true
      });
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isOtherMonth: false
      });
    }
    
    // Fill remaining cells to complete the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      days.push({
        date: nextMonthDay,
        isOtherMonth: true
      });
    }
    
    return days;
  };
  
  // Get data from Redux store
  const { 
    list: dependents, 
    isLoading, 
    error,
    stats,
    recentActivity 
  } = useSelector(state => state.beneficiaries);
  const { user } = useSelector(state => state.authentication);
  
  const token = localStorage.getItem('token');

  // Initialize data on component mount with smart caching
  useEffect(() => {
    if (token && user) {
      // Set current user for proper data segmentation
      dispatch(setCurrentUser(user.id));
      
      // Initialize beneficiaries with smart caching
      dispatch(initializeBeneficiaries({ forceRefresh: false }));
    }
  }, [dispatch, token, user?.id]); // Added user.id to dependencies

  // Function to manually refresh data
  const handleRefreshData = () => {
    if (token && user) {
      console.log('🔄 Manually refreshing caregiver data...');
      dispatch(forceRefresh());
      dispatch(initializeBeneficiaries({ forceRefresh: true }));
    }
  };

  // Generate mock daily expenses based on selected date and dependent
  const getDailyExpenses = (selectedDependent, date) => {
    if (!selectedDependent) return 0;
    
    // Use date and dependent ID to generate consistent but varied daily expenses
    const dateStr = date.toDateString();
    const dependentId = selectedDependent.id || 0;
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const dayOfWeek = date.getDay();
    
    // Create a more complex seed for better variation
    const complexSeed = dateStr.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + 
                       dependentId * 17 + 
                       dayOfYear * 3 + 
                       dayOfWeek * 7;
    
    // Generate different expense ranges based on day of week
    let minExpense, maxExpense;
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
      minExpense = 200;
      maxExpense = 800;
    } else if (dayOfWeek === 1 || dayOfWeek === 5) { // Monday/Friday 
      minExpense = 150;
      maxExpense = 600;
    } else { // Midweek
      minExpense = 100;
      maxExpense = 500;
    }
    
    // Generate daily expenses with more variation
    const range = maxExpense - minExpense;
    const dailyExpense = minExpense + (complexSeed % range);
    
    const baseAmount = selectedDependent.account?.balance || 1000;
    return Math.min(dailyExpense, baseAmount * 0.15); // Max 15% of total balance per day
  };

  // Calculate dynamic account data based on dependents and selected date
  const getAccountsData = () => {
    const allAccounts = [
      { color: '#a084ee', label: 'Baby Care Account', type: 'babycare' },
      { color: '#3b82f6', label: 'Entertainment Account', type: 'entertainment' },
      { color: '#ffb84c', label: 'Healthcare Account', type: 'healthcare' },
      { color: '#4ade80', label: 'Education Account', type: 'education' },
      { color: '#f43f5e', label: 'Food & Nutrition Account', type: 'food' },
      { color: '#8b5cf6', label: 'Clothing Account', type: 'clothing' },
      { color: '#06b6d4', label: 'Transport Account', type: 'transport' },
      { color: '#f97316', label: 'Emergency Account', type: 'emergency' },
    ];

    if (!dependents.length) {
      return allAccounts.map(account => ({
        ...account,
        percent: 0,
        balance: 0,
        dailyExpense: 0
      }));
    }

    const selectedDependent = dependents[selectedDependentIndex];
    if (!selectedDependent) {
      return allAccounts.map(account => ({
        ...account,
        percent: 0,
        balance: 0,
        dailyExpense: 0
      }));
    }

    // Get total daily expenses for the selected date
    const totalDailyExpense = getDailyExpenses(selectedDependent, selectedDate);
    const dayOfWeek = selectedDate.getDay();
    
    // Daily expense distribution per account type - varies by day of week
    let dailyDistribution;
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
      dailyDistribution = {
        babycare: 0.10,     // 10% - less on weekends
        entertainment: 0.25, // 25% - more entertainment on weekends
        healthcare: 0.08,   // 8% - less healthcare on weekends
        education: 0.05,    // 5% - less education on weekends
        food: 0.30,         // 30% - more food on weekends
        clothing: 0.08,     // 8% - more shopping on weekends
        transport: 0.10,    // 10% - more travel on weekends
        emergency: 0.04     // 4% - less emergency on weekends
      };
    } else if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Weekdays
      dailyDistribution = {
        babycare: 0.15,     // 15% - more on weekdays
        entertainment: 0.08, // 8% - less entertainment on weekdays
        healthcare: 0.20,   // 20% - more healthcare on weekdays
        education: 0.30,    // 30% - more education on weekdays
        food: 0.15,         // 15% - less food on weekdays
        clothing: 0.03,     // 3% - less shopping on weekdays
        transport: 0.05,    // 5% - less travel on weekdays
        emergency: 0.04     // 4% - steady emergency
      };
    } else {
      // Default distribution
      dailyDistribution = {
        babycare: 0.12,     // 12% of daily expenses
        entertainment: 0.08, // 8% of daily expenses  
        healthcare: 0.18,   // 18% of daily expenses
        education: 0.25,    // 25% of daily expenses
        food: 0.20,         // 20% of daily expenses
        clothing: 0.05,     // 5% of daily expenses
        transport: 0.07,    // 7% of daily expenses
        emergency: 0.05     // 5% of daily expenses
      };
    }

    // Account balance distribution (total available)
    const totalBalance = selectedDependent.account?.balance || 0;
    const accountDistribution = {
      babycare: 0.15,
      entertainment: 0.10,
      healthcare: 0.25,
      education: 0.20,
      food: 0.15,
      clothing: 0.05,
      transport: 0.05,
      emergency: 0.05
    };

    return allAccounts.map(account => {
      const dailyExpense = totalDailyExpense * dailyDistribution[account.type];
      const totalAccountBalance = totalBalance * accountDistribution[account.type];
      const percentOfDaily = totalDailyExpense > 0 ? (dailyExpense / totalDailyExpense) * 100 : 0;
      
      return {
        ...account,
        percent: percentOfDaily,
        balance: totalAccountBalance,
        dailyExpense: dailyExpense
      };
    });
  };

  const accountsData = getAccountsData();
  const recentTransactions = recentActivity?.transactions || [];
  
  // Mock requests data - replace with real API when available
  const requests = [
    { name: 'Healthcare Request', reason: 'Medical expenses', amount: `R${(stats?.totalAccountBalance * 0.1 || 1000).toFixed(0)}` },
    { name: 'Education Request', reason: 'School fees', amount: `R${(stats?.totalAccountBalance * 0.15 || 1500).toFixed(0)}` },
    { name: 'Emergency Request', reason: 'Urgent care', amount: `R${(stats?.totalAccountBalance * 0.05 || 500).toFixed(0)}` },
  ];

  useEffect(() => {
    // Check if we should show the profile completion popup
    const checkShowPopup = () => {
      const dismissed = localStorage.getItem('profileCompletionDismissed');
      const reminderTime = localStorage.getItem('profileCompletionReminder');
      const currentTime = Date.now();

      // Don't show if user has dismissed it permanently
      if (dismissed === 'true') {
        return false;
      }

      // Don't show if we're still in the reminder period
      if (reminderTime && currentTime < parseInt(reminderTime)) {
        return false;
      }

      // Check if profile is complete by looking at required fields
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const requiredFields = [
            'firstName', 'surname', 'email', 'phoneNumber', 'Idnumber',
            'postalAddressLine1', 'postalCity', 'postalProvince', 'postalCode',
            'homeAddressLine1', 'homeCity', 'homeProvince', 'homeCode'
          ];
          
          const missingFields = requiredFields.filter(field => 
            !userData[field] || userData[field].toString().trim() === ''
          );
          
          // Show popup if there are missing fields
          return missingFields.length > 0;
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          return false;
        }
      }

      return false;
    };

    // Show popup after a short delay to let the dashboard load
    const timer = setTimeout(() => {
      if (checkShowPopup()) {
        setShowProfilePopup(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleCompleteProfile = () => {
    setShowProfilePopup(false);
    // Navigate to profile page (all roles use /profile route)
    navigate('/profile');
  };

  const handleClosePopup = () => {
    setShowProfilePopup(false);
  };

  return (
    <>
      <MainContent>
      <ResponsiveWrapper>
        {/* Statistics Summary Card */}
        <Card style={{ 
          marginBottom: '12px', 
          background: 'linear-gradient(135deg, #185c37, #1e6b42)',
          color: 'white',
          minHeight: '120px',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>
              Overview
            </h3>
            {isLoading && (
              <div style={{ fontSize: '11px', opacity: 0.8 }}>Loading...</div>
            )}
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: '12px' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '2px' }}>
                {stats?.totalDependents || dependents.length || 0}
              </div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>Total Dependents</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '2px' }}>
                {stats?.dependentsByStatus?.active || 0}
              </div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>Active Accounts</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2px' }}>
                {stats?.currency || 'ZAR'} {stats?.totalAccountBalance?.toFixed(2) || '0.00'}
              </div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>Total Balance</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '2px' }}>
                {recentActivity?.totalTransactions || 0}
              </div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>Recent Transactions</div>
            </div>
          </div>
        </Card>

        <Grid>
          {/* Left: Monthly expenses and bar chart */}
          <Card>
            {/* Avatars and dependent name */}
            <AvatarsRow>
              <DependentName>
                {dependents.length > 0 && dependents[selectedDependentIndex] ? 
                  dependents[selectedDependentIndex].name || 
                  `${dependents[selectedDependentIndex]?.firstName || ''} ${dependents[selectedDependentIndex]?.surname || ''}`.trim() || 
                  'Unknown Dependent' : 'No Dependent Selected'}
              </DependentName>
              <AvatarsGroup>
               
                <Avatar 
                  style={{ background: '#ff4c60' }}
                  onClick={goToNextDependent}
                  title={dependents.length > 1 ? "Switch to next dependent" : "No other dependents"}
                >
                  {dependents.length > 0 && dependents[selectedDependentIndex] ? 
                    dependents[selectedDependentIndex].name?.charAt(0) || 
                    dependents[selectedDependentIndex].firstName?.charAt(0) || 'D' : 'D'}
                </Avatar>
                <ArrowButton 
                  onClick={goToNextDependent}
                  disabled={dependents.length <= 1}
                  title={dependents.length > 1 ? "Switch to next dependent" : "No other dependents"}
                >
                  <img src={arrowIcon} alt="Switch Dependent" style={{ width: 24, height: 24 }} />
                </ArrowButton>
              </AvatarsGroup>
            </AvatarsRow>
            
            {/* Dots below avatars */}
            <DotsRow>
              {dependents.map((_, index) => (
                <DotIndicator 
                  key={index} 
                  active={index === selectedDependentIndex}
                  onClick={() => setSelectedDependentIndex(index)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
              {dependents.length === 0 && <DotIndicator active />}
            </DotsRow>

            {/* Dependent Toggle */}
            {dependents.length > 0 && (
              <DependentToggle>
          
                <div style={{ display: 'flex', gap: '4px' }}>
                
                </div>
              </DependentToggle>
            )}
            
            {/* Date Selection with Calendar Picker */}
            <DateSelector>
              <DateDisplay>
                <DateText>{formatDate(selectedDate)}</DateText>
              </DateDisplay>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div onClick={toggleCalendarPicker} style={{ cursor: 'pointer', padding: '4px', borderRadius: '4px', transition: 'background 0.2s' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                    <circle cx="8" cy="14" r="1"/>
                    <circle cx="12" cy="14" r="1"/>
                    <circle cx="16" cy="14" r="1"/>
                    <circle cx="8" cy="18" r="1"/>
                    <circle cx="12" cy="18" r="1"/>
                  </svg>
                </div>
                {!isToday() && (
                  <TodayButton onClick={goToToday}>
                    Today
                  </TodayButton>
                )}
              </div>

              {/* Calendar Picker */}
              {showCalendarPicker && (
                <CalendarPicker>
                  <CalendarGrid>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <DayHeader key={day}>{day}</DayHeader>
                    ))}
                    
                    {generateCalendarDays().map((dayInfo, index) => {
                      const isSelected = dayInfo.date.toDateString() === selectedDate.toDateString();
                      const isToday = dayInfo.date.toDateString() === new Date().toDateString();
                      
                      return (
                        <DayCell
                          key={index}
                          isSelected={isSelected}
                          isToday={isToday}
                          isOtherMonth={dayInfo.isOtherMonth}
                          onClick={() => selectDate(dayInfo.date)}
                        >
                          {dayInfo.date.getDate()}
                        </DayCell>
                      );
                    })}
                  </CalendarGrid>
                </CalendarPicker>
              )}
            </DateSelector>
            
            {/* Account Balance Header */}
            <AccountsHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ color: '#222', fontWeight: 500, fontSize: 16 }}>
                  {dependents.length > 0 && dependents[selectedDependentIndex] ? 
                    `Balance: ${stats?.currency || 'ZAR'} ${(dependents[selectedDependentIndex].account?.balance || 0).toFixed(2)}` :
                    `Total Balance: ${stats?.currency || 'ZAR'} ${stats?.totalAccountBalance?.toFixed(2) || '0.00'}`
                  }
                </div>
              </div>
            </AccountsHeader>
            
            {/* Bar Chart */}
            <BarChart style={{ margin: '10px 0 8px 0' }}>
              {accountsData.map((acc, i) => (
                <Bar key={acc.label} color={acc.color} $percent={acc.percent} />
              ))}
            </BarChart>
            
            {/* Scrollable Legend for All 8 Accounts */}
            <Legend>
              {accountsData.map(acc => (
                <LegendRow key={acc.label}>
                  <Dot color={acc.color} />
                  <div style={{ flex: 1 }}>
                    <span>{acc.label}</span>
                    <DailyExpenseText>
                      Daily: {stats?.currency || 'ZAR'} {acc.dailyExpense.toFixed(2)}
                    </DailyExpenseText>
                  </div>
                  <span style={{ color: '#888', fontSize: '12px' }}>
                    {acc.percent.toFixed(1)}% ({stats?.currency || 'ZAR'} {acc.balance.toFixed(0)})
                  </span>
                </LegendRow>
              ))}
            </Legend>
          </Card>
          {/* Right: Transaction History */}
          <Card>
            <SectionTitle>
              Recent Activity 
              <SeeAll onClick={() => navigate('/caregiver/beneficiaries')}>
                see all &rarr;
              </SeeAll>
            </SectionTitle>
            <TransactionList>
              {isLoading ? (
                <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                  Loading transactions...
                </div>
              ) : recentTransactions.length > 0 ? (
                recentTransactions.slice(0, 11).map((tx, i) => (
                  <TransactionItem key={tx.id || i}>
                    <TransactionAvatar>
                      {tx.dependent?.name?.charAt(0) || 'D'}
                    </TransactionAvatar>
                    <TransactionInfo>
                      <TransactionName>
                        {tx.description || 'Transaction'}
                      </TransactionName>
                      <TransactionDate>
                        {new Date(tx.timestamp || tx.createdAt).toLocaleDateString('en-ZA', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TransactionDate>
                    </TransactionInfo>
                    <TransactionAmount style={{
                      color: tx.type === 'Credit' ? '#4ade80' : '#ef4444'
                    }}>
                      {tx.type === 'Credit' ? '+' : '-'}R{tx.amount?.toFixed(2) || '0.00'}
                    </TransactionAmount>
                  </TransactionItem>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                  No recent transactions
                </div>
              )}
            </TransactionList>
          </Card>
        </Grid>
        <RequestsCard>
          <SectionTitle style={{ padding: '0 12px 0 12px' }}>
            Requests <SeeAll>see all &rarr;</SeeAll>
          </SectionTitle>
          <RequestsTable>
            {requests.map((req, i) => (
              <RequestRow key={i}>
                <RequestName>{req.name}</RequestName>
                <RequestReason>{req.reason}</RequestReason>
                <RequestAmount>{req.amount}</RequestAmount>
                <RequestAction>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="2" fill="#888"/><circle cx="12" cy="12" r="2" fill="#888"/><circle cx="19" cy="12" r="2" fill="#888"/></svg>
                </RequestAction>
              </RequestRow>
            ))}
          </RequestsTable>
        </RequestsCard>
      </ResponsiveWrapper>
      
      {/* Profile Completion Popup */}
      {showProfilePopup && (
        <ProfileCompletionPopup
          onClose={handleClosePopup}
          onCompleteProfile={handleCompleteProfile}
        />
      )}
    </MainContent>
    </>
  );
};

export default CareGiverHome;