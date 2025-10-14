import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import homeIcon from '../../assets/icons/home-icon.png';
import expensesIcon from '../../assets/icons/expenses.png';
import requestIcon from '../../assets/icons/send-money-icon.png';
import statementsIcon from '../../assets/icons/statements-icon.png';
import messagesIcon from '../../assets/icons/beneficiary.png';

const SidebarContainer = styled.div`
  width: 235px;
  min-height: 100vh;
  background-color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-right: 2px solid gray;
  font-family: 'Poppins', sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 99;
`;

const Logo = styled.div`
  color: #FD3E6E;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MenuItem = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  color: ${props => props.active ? '#fff' : '#444'};
  background-color: ${props => props.active ? '#FD3E6E' : 'transparent'};
  margin-bottom: 8px;
  transition: all 0.3s ease;
  font-weight: ${props => props.active ? '500' : 'normal'};

  &:hover {
    background-color: #fff0f4;
    color: #FD3E6E;
  }

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    filter: ${props => props.active ? 'brightness(0) invert(1)' : 'none'};
  }
`;

const CareGiverSidebar = () => {
  const location = useLocation();
  return (
    <SidebarContainer>
      <Logo>
        <img src={logo} alt="Nana" width="90" height="70" />
      </Logo>
      <MenuItem to="/caregiver-home" active={location.pathname === "/caregiver-home" ? 1 : 0}>
        <img src={homeIcon} alt="Home" />
        Home
      </MenuItem>

      <MenuItem to="/caregiver-beneficiary" active={location.pathname === "/caregiver-beneficiary" ? 1 : 0}>
        <img src={messagesIcon} alt="Beneficiary" />
        Beneficiary
      </MenuItem>
      <MenuItem to="/caregiver-expenses" active={location.pathname === "/caregiver-expenses" ? 1 : 0}>
        <img src={expensesIcon} alt="Track Expenses" />
        Track Expenses
      </MenuItem>
      <MenuItem to="/caregiver-requests" active={location.pathname === "/caregiver-requests" ? 1 : 0}>
        <img src={requestIcon} alt="Send Request" />
        Send Request
      </MenuItem>
      <MenuItem to="/caregiver-statements" active={location.pathname === "/caregiver-statements" ? 1 : 0}>
        <img src={statementsIcon} alt="Statements" />
        Statements
      </MenuItem>
      
    </SidebarContainer>
  );
};

export default CareGiverSidebar;