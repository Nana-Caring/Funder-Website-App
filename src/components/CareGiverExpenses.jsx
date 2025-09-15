import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import avatar1 from '../assets/avatars/avatar1.png';
import expensesIcon from '../assets/icons/expenses.png';
import { 
  fetchDependents, 
  fetchCaregiverStats, 
  fetchCaregiverTransactions,
  fetchDependentTransactions,
  fetchTransactionAnalytics,
  fetchDependentById 
} from '../store/slices/beneficiaries';

// Styled components start here

const Container = styled.div`
  width: calc(100% - 250px);
  margin-left: auto;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  height: calc(100vh - 80px);
`;

const Card = styled.div`
  width: 100%;
  max-width: 800px; /* Increased from 400px to 800px */
  background: white;
  border-radius: 12px;
  padding: 24px; /* Increased padding for better spacing */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
`;

const StackedProgressContainer = styled.div`
  display: flex;
  height: 32px; /* Increased height to accommodate text */
  border-radius: 4px;
  overflow: hidden;
  margin: 16px 0;
`;

const Segment = styled.div`
  height: 100%;
  background-color: ${props => props.color};
  width: ${props => props.width}%;
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 11px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  white-space: nowrap;
  
  /* Hide text if segment is too small */
  ${props => props.width < 8 && `
    font-size: 0;
  `}
  
  ${props => props.width < 15 && props.width >= 8 && `
    font-size: 9px;
  `}
`;

const LegendWrapper = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  
  &::-webkit-scrollbar {
    height: 4px;
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

const LegendItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  padding: 12px 8px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  font-size: 12px;
  color: #444;
  flex-shrink: 0;
  text-align: center;
  gap: 4px;
`;

const AccountName = styled.div`
  font-weight: 500;
  color: #333;
  line-height: 1.2;
`;

const AccountPercent = styled.div`
  font-weight: 600;
  color: #666;
  font-size: 14px;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const AccountBalance = styled.div`
  font-size: 11px;
  color: #666;
  font-weight: 500;
`;

const ColorDotLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
`;

const ColorDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const SectionTitle = styled.div`
  background-color: #d4e9d7;
  color: #2e7d32;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: bold;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 14px;
  font-weight: bold;
  border-bottom: 2px solid #ccc;
  padding-bottom: 4px;
`;

const ActiveTab = styled.span`
  color: #c1126b;
  border-bottom: 3px solid #c1126b;
`;

const TransactionItem = styled.div`
  margin: 16px 0 8px;
`;

const DateLabel = styled.div`
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
`;

const TransactionCard = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: #f9f9f9;
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 6px;
`;

const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TransactionDetails = styled.div`
  font-size: 14px;
  color: #333;
  margin-top: 4px;
`;

const Amount = styled.div`
  color: #c1126b;
  font-weight: bold;
`;

const TransactionsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 8px;
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

const TabButton = styled.span`
  cursor: pointer;
  padding: 4px 8px;
  color: ${props => (props.active ? '#c1126b' : '#666')};
  border-bottom: ${props => (props.active ? '3px solid #c1126b' : 'none')};
  transition: all 0.2s ease;

  &:hover {
    color: #c1126b;
  }
`;

const BeneficiaryToggle = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  overflow-x: auto;
  max-width: 100%;
  
  &::-webkit-scrollbar {
    height: 4px;
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

const BeneficiaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  background: ${props => props.active ? '#f0f0f0' : 'transparent'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 140px;
  justify-content: flex-start;

  &:hover {
    background: #f0f0f0;
  }
`;

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;
`;

const NavigationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
  font-size: 14px;
  flex-shrink: 0;

  &:hover {
    background: #f0f0f0;
    border-color: #999;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f9f9f9;
  }
`;

const DependentSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`;

const DependentsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex: 1;
  justify-content: center;
  min-width: 0;
  overflow: hidden;
  position: relative;
  min-height: 48px;
  align-items: center;
`;

const DependentsSlider = styled.div`
  display: flex;
  gap: 8px;
  transition: transform 0.3s ease;
  transform: translateX(${props => props.offset}px);
  width: fit-content;
`;

const ExpenseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  position: relative;
`;

const ExpenseTitle = styled.h3`
  font-size: 14px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CalendarIcon = styled.button`
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
  }
  
  svg {
    width: 16px;
    height: 16px;
    stroke: #666;
  }
`;

const CalendarDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 16px;
  min-width: 280px;
  margin-top: 8px;
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const MonthYear = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 18px;
  line-height: 1;
  
  &:hover {
    background: #f1f1f1;
    color: #333;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 12px;
`;

const DayHeader = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-align: center;
  padding: 8px 4px;
  text-transform: uppercase;
`;

const DayCell = styled.button`
  background: ${props => 
    props.isSelected ? '#185c37' : 
    props.isToday ? '#e8f5e8' : 
    'transparent'
  };
  color: ${props => 
    props.isSelected ? 'white' : 
    props.isToday ? '#185c37' :
    props.isOtherMonth ? '#ccc' : '#333'
  };
  border: ${props => props.isToday && !props.isSelected ? '1px solid #185c37' : '1px solid transparent'};
  padding: 8px 4px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;
  min-height: 32px;
  
  &:hover {
    background: ${props => props.isSelected ? '#1e6b42' : '#f1f1f1'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
`;

const TodayButton = styled.button`
  background: #185c37;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  
  &:hover {
    background: #1e6b42;
  }
`;

const CareGiverExpenses = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('currentMonth');
  const [activeBeneficiaryIndex, setActiveBeneficiaryIndex] = useState(0);
  const [dependentPage, setDependentPage] = useState(0);
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());

  // Get data from Redux store
  const { 
    list: dependents, 
    isLoading, 
    error,
    stats,
    transactions 
  } = useSelector(state => state.beneficiaries);
  const { user } = useSelector(state => state.authentication);
  
  const token = localStorage.getItem('token');

  // Fetch data on component mount
  useEffect(() => {
    if (token) {
      dispatch(fetchCaregiverStats(token));
      dispatch(fetchDependents({ token, params: { limit: 10 } }));
      dispatch(fetchCaregiverTransactions({ token, params: { limit: 50, days: 30 } }));
      dispatch(fetchTransactionAnalytics({ token, params: { days: 30 } }));
    }
  }, [dispatch, token]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCalendarPicker && !event.target.closest('[data-calendar]')) {
        setShowCalendarPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendarPicker]);

  // Calendar picker functions
  const toggleCalendarPicker = () => {
    setShowCalendarPicker(!showCalendarPicker);
    setCalendarViewDate(selectedDate);
  };

  const selectDate = (date) => {
    setSelectedDate(date);
    setShowCalendarPicker(false);
    // You can add logic here to filter transactions by selected date
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

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCalendarViewDate(today);
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

  // Format date for display
  const formatSelectedDate = () => {
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get the active beneficiary
  const activeBeneficiary = dependents[activeBeneficiaryIndex] || null;

  // Pagination logic for dependents - show one at a time
  const dependentsPerPage = 1;
  const totalPages = dependents.length;
  const currentDependent = dependents[activeBeneficiaryIndex];
  const hasMultiplePages = dependents.length > 1;

  // Generate account distribution based on real dependent data
  const getAccountsData = (dependent) => {
    if (!dependent) {
      return [
        { color: '#a084ee', label: 'Baby Care Account', percent: 0, balance: 0 },
        { color: '#3b82f6', label: 'Entertainment Account', percent: 0, balance: 0 },
        { color: '#ffb84c', label: 'Healthcare Account', percent: 0, balance: 0 },
        { color: '#4ade80', label: 'Education Account', percent: 0, balance: 0 },
        { color: '#f43f5e', label: 'Food & Nutrition Account', percent: 0, balance: 0 },
        { color: '#8b5cf6', label: 'Clothing Account', percent: 0, balance: 0 },
        { color: '#06b6d4', label: 'Transport Account', percent: 0, balance: 0 },
        { color: '#f97316', label: 'Emergency Account', percent: 0, balance: 0 },
      ];
    }

    // Use real account data or calculate based on dependent profile
    const totalBalance = dependent.account?.balance || 1000;
    const age = dependent.age || 5;
    const dependentType = dependent.dependentType || 'child';
    
    // Dynamic distribution based on dependent characteristics
    let baseDistribution = {
      babycare: age < 3 ? 0.25 : age < 6 ? 0.15 : 0.05,
      entertainment: age < 6 ? 0.05 : age < 12 ? 0.15 : 0.20,
      healthcare: dependentType === 'elderly' ? 0.35 : 0.20,
      education: age < 3 ? 0.05 : age < 18 ? 0.25 : 0.10,
      food: 0.20,
      clothing: age < 12 ? 0.10 : 0.15,
      transport: age < 6 ? 0.05 : 0.10,
      emergency: 0.10
    };

    // Normalize to 100%
    const total = Object.values(baseDistribution).reduce((sum, val) => sum + val, 0);
    Object.keys(baseDistribution).forEach(key => {
      baseDistribution[key] = baseDistribution[key] / total;
    });

    return [
      { 
        color: '#a084ee', 
        label: 'Baby Care Account', 
        percent: Math.round(baseDistribution.babycare * 100),
        balance: Math.round(totalBalance * baseDistribution.babycare)
      },
      { 
        color: '#3b82f6', 
        label: 'Entertainment Account', 
        percent: Math.round(baseDistribution.entertainment * 100),
        balance: Math.round(totalBalance * baseDistribution.entertainment)
      },
      { 
        color: '#ffb84c', 
        label: 'Healthcare Account', 
        percent: Math.round(baseDistribution.healthcare * 100),
        balance: Math.round(totalBalance * baseDistribution.healthcare)
      },
      { 
        color: '#4ade80', 
        label: 'Education Account', 
        percent: Math.round(baseDistribution.education * 100),
        balance: Math.round(totalBalance * baseDistribution.education)
      },
      { 
        color: '#f43f5e', 
        label: 'Food & Nutrition Account', 
        percent: Math.round(baseDistribution.food * 100),
        balance: Math.round(totalBalance * baseDistribution.food)
      },
      { 
        color: '#8b5cf6', 
        label: 'Clothing Account', 
        percent: Math.round(baseDistribution.clothing * 100),
        balance: Math.round(totalBalance * baseDistribution.clothing)
      },
      { 
        color: '#06b6d4', 
        label: 'Transport Account', 
        percent: Math.round(baseDistribution.transport * 100),
        balance: Math.round(totalBalance * baseDistribution.transport)
      },
      { 
        color: '#f97316', 
        label: 'Emergency Account', 
        percent: Math.round(baseDistribution.emergency * 100),
        balance: Math.round(totalBalance * baseDistribution.emergency)
      },
    ];
  };

  // Process real transactions from API
  const processTransactions = () => {
    if (!transactions?.all || !Array.isArray(transactions.all)) {
      return {
        lastMonth: [],
        currentMonth: [],
        future: []
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const processedTransactions = {
      lastMonth: [],
      currentMonth: [],
      future: []
    };

    transactions.all.forEach(tx => {
      if (!tx.timestamp && !tx.createdAt && !tx.date) return;
      
      const txDate = new Date(tx.timestamp || tx.createdAt || tx.date);
      const txMonth = txDate.getMonth();
      const txYear = txDate.getFullYear();

      // Map transaction types to categories and colors
      const getCategoryInfo = (description) => {
        const desc = (description || '').toLowerCase();
        if (desc.includes('health') || desc.includes('medical') || desc.includes('doctor')) {
          return { category: 'Healthcare', color: '#ffb84c' };
        } else if (desc.includes('school') || desc.includes('education') || desc.includes('fee')) {
          return { category: 'Education', color: '#4ade80' };
        } else if (desc.includes('food') || desc.includes('grocery') || desc.includes('meal')) {
          return { category: 'Food & Nutrition', color: '#f43f5e' };
        } else if (desc.includes('game') || desc.includes('entertainment') || desc.includes('movie')) {
          return { category: 'Entertainment', color: '#3b82f6' };
        } else if (desc.includes('baby') || desc.includes('diaper') || desc.includes('formula')) {
          return { category: 'Baby Care', color: '#a084ee' };
        } else if (desc.includes('clothes') || desc.includes('clothing')) {
          return { category: 'Clothing', color: '#8b5cf6' };
        } else if (desc.includes('transport') || desc.includes('taxi') || desc.includes('bus')) {
          return { category: 'Transport', color: '#06b6d4' };
        } else {
          return { category: 'Emergency', color: '#f97316' };
        }
      };

      const categoryInfo = getCategoryInfo(tx.description);
      
      const processedTx = {
        date: txDate.toLocaleDateString('en-ZA', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        category: categoryInfo.category,
        location: tx.description || 'Transaction',
        amount: tx.type === 'Credit' ? `+R${tx.amount?.toFixed(2) || '0.00'}` : `-R${tx.amount?.toFixed(2) || '0.00'}`,
        color: categoryInfo.color,
      };

      // Categorize by time period
      if (txYear === lastMonthYear && txMonth === lastMonth) {
        processedTransactions.lastMonth.push(processedTx);
      } else if (txYear === currentYear && txMonth === currentMonth) {
        processedTransactions.currentMonth.push(processedTx);
      } else if (txDate > now) {
        processedTransactions.future.push(processedTx);
      } else {
        // Default to current month for other transactions
        processedTransactions.currentMonth.push(processedTx);
      }
    });

    return processedTransactions;
  };

  const processedTransactions = processTransactions();
  const accountsData = getAccountsData(activeBeneficiary);

  const tabTitles = {
    lastMonth: 'Last Month',
    currentMonth: 'Current Month',
    future: 'Future',
  };

  const calculateTotalExpenses = () => {
    if (!processedTransactions[activeTab]) return '0.00';
    
    return processedTransactions[activeTab].reduce((total, tx) => {
      const amount = Math.abs(parseFloat(tx.amount.replace('R', '').replace(',', '')));
      return total + amount;
    }, 0).toFixed(2);
  };

  const getTabTotal = (transactionList) => {
    if (!transactionList) return '0.00';
    
    return transactionList.reduce((total, tx) => {
      const amount = Math.abs(parseFloat(tx.amount.replace('R', '').replace(',', '')));
      return total + amount;
    }, 0).toFixed(2);
  };

  if (isLoading) {
    return (
      <Container>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading expenses data...
          </div>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
            Error loading data: {error}
          </div>
        </Card>
      </Container>
    );
  }

  if (!dependents.length) {
    return (
      <Container>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No dependents found. Please add dependents to view expenses.
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <DependentSection>
          <NavigationButton 
            onClick={() => setActiveBeneficiaryIndex(Math.max(0, activeBeneficiaryIndex - 1))}
            disabled={activeBeneficiaryIndex === 0 || !hasMultiplePages}
          >
            ‹
          </NavigationButton>
          
          <DependentsContainer>
            <DependentsSlider offset={0}>
              {currentDependent && (
                <BeneficiaryButton
                  key={currentDependent.id || activeBeneficiaryIndex}
                  active={true}
                  onClick={() => {}} // No action needed since it's already active
                >
                  <Avatar color={getAvatarColor(activeBeneficiaryIndex)}>
                    {(currentDependent.name || currentDependent.firstName || 'D').charAt(0).toUpperCase()}
                  </Avatar>
                  <span style={{ 
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    {currentDependent.name || `${currentDependent.firstName || ''} ${currentDependent.surname || ''}`.trim() || 'Dependent'}
                  </span>
                </BeneficiaryButton>
              )}
            </DependentsSlider>
          </DependentsContainer>

          <NavigationButton 
            onClick={() => setActiveBeneficiaryIndex(Math.min(dependents.length - 1, activeBeneficiaryIndex + 1))}
            disabled={activeBeneficiaryIndex === dependents.length - 1 || !hasMultiplePages}
          >
            ›
          </NavigationButton>
        </DependentSection>
        </div>
        
        <ExpenseHeader>
          <ExpenseTitle>
            Monthly expenses
            <CalendarIcon onClick={toggleCalendarPicker} title="Select date">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </CalendarIcon>
          </ExpenseTitle>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {formatSelectedDate()}
          </div>
          
          {showCalendarPicker && (
            <CalendarDropdown data-calendar>
              <CalendarHeader>
                <NavButton onClick={goToPreviousMonth}>‹</NavButton>
                <MonthYear>
                  {calendarViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </MonthYear>
                <NavButton onClick={goToNextMonth}>›</NavButton>
              </CalendarHeader>
              
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
              
              <TodayButton onClick={goToToday}>
                Go to Today
              </TodayButton>
            </CalendarDropdown>
          )}
        </ExpenseHeader>

        <StackedProgressContainer>
          {accountsData.map((acc, idx) => (
            <Segment key={idx} color={acc.color} width={acc.percent}>
              {acc.percent >= 8 ? (
                acc.percent >= 15 ? acc.label.split(' ')[0] : acc.label.charAt(0)
              ) : null}
            </Segment>
          ))}
        </StackedProgressContainer>

      
        <SectionTitle>
          <span>Monthly Transactions</span>
          <span>R{getTabTotal(processedTransactions[activeTab])}</span>
        </SectionTitle>

        <Tabs>
          {Object.keys(tabTitles).map(tab => (
            <TabButton
              key={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tabTitles[tab]}
            </TabButton>
          ))}
        </Tabs>

        <TransactionsContainer>
          {processedTransactions[activeTab] && processedTransactions[activeTab].length > 0 ? (
            processedTransactions[activeTab].map((tx, index) => (
              <TransactionItem key={index}>
                <DateLabel>{tx.date}</DateLabel>
                <TransactionCard>
                  <div>
                    <CategoryInfo>
                      <ColorDot color={tx.color} />
                      <strong>{tx.category}</strong>
                    </CategoryInfo>
                    <TransactionDetails>{tx.location}</TransactionDetails>
                  </div>
                  <Amount>{tx.amount}</Amount>
                </TransactionCard>
              </TransactionItem>
            ))
          ) : (
            <div style={{ 
              textAlign: 'center', 
              color: '#666', 
              padding: '40px 20px',
              fontSize: '14px'
            }}>
              No transactions found for {tabTitles[activeTab].toLowerCase()}
            </div>
          )}
        </TransactionsContainer>
      </Card>
    </Container>
  );

  // Helper function to get avatar colors
  function getAvatarColor(index) {
    const colors = ['#185c37', '#c1126b', '#3b82f6', '#ff9500', '#9c27b0', '#607d8b'];
    return colors[index % colors.length];
  }
};

export default CareGiverExpenses;
