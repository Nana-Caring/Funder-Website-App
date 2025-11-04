import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import homeIcon from '../../assets/icons/home-icon.png';
import buyIcon from '../../assets/icons/buy.png'; 
import myAccountIcon from '../../assets/icons/my-account-icon.png';
import transferMoneyIcon from '../../assets/icons/send-money-icon.png'; // Reusing send-money for transfer
import statementsIcon from '../../assets/icons/statements-icon.png';
import trackIcon from '../../assets/icons/track.png';

const SidebarContainer = styled.div`
  width: 235px;
  min-height: 100vh; /* Adjusted to min-height */
  background-color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-right: 2px solid gray;
  font-family: 'Poppins', sans-serif;
  overflow-y: auto; /* Add scrolling if menu items exceed height */
  position: fixed; /* Add position: fixed back */
  top: 0;
  left: 0;
  z-index: 200; /* Ensure sidebar is above content */
  box-sizing: border-box; /* Include padding and border in the element's total width */

  @media (max-width: 1024px) {
    width: 70%;
    max-width: 250px;
    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
    display: ${props => (props.$isOpen ? 'flex' : 'none')};
    background: #fff;
  }
  
  @media (max-width: 768px) {
    width: 60%;
    max-width: 200px;
    padding: 15px;
  }
`;

const Logo = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 40px;
  object-fit: contain;
`;

const MenuItem = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  color: ${props => props.active ? 'black' : '#666'};
  background-color: ${props => props.active ? '#FD3E6E' : 'transparent'};
  margin-bottom: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #fff0f4;
    color: #ff4081;
  }

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
`;

const DependentSidebar = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  return (
    <SidebarContainer $isOpen={isOpen}>
      <Logo src={logo} alt="Nana" />

      <MenuItem to="/dependent-home" active={location.pathname === "/dependent-home" ? 1 : 0} onClick={onClose}>
        <img src={homeIcon} alt="Home" />
        Home
      </MenuItem>

      {/* Placeholder routes for now */}      
      <MenuItem to="/dependent-buy" active={location.pathname === "/dependent-buy" ? 1 : 0} onClick={onClose}>
        <img src={buyIcon} alt="Buy" />
        Buy
      </MenuItem>

      <MenuItem to="/dependent-myaccounts" active={location.pathname === "/dependent-myaccounts" ? 1 : 0} onClick={onClose}>
        <img src={myAccountIcon} alt="My Accounts" />
        My Accounts
      </MenuItem>

      <MenuItem to="/dependent-transfer" active={location.pathname === "/dependent-transfer" ? 1 : 0} onClick={onClose}>
        <img src={transferMoneyIcon} alt="Transfer Money" />
        Transfer Money
      </MenuItem>

      <MenuItem to="/dependent-statements" active={location.pathname === "/dependent-statements" ? 1 : 0} onClick={onClose}>
        <img src={statementsIcon} alt="Statements" />
        Statements
      </MenuItem>

      <MenuItem to="/dependent-orders" active={location.pathname === "/dependent-orders" ? 1 : 0} onClick={onClose}>
        <img src={trackIcon} alt="Orders" />
        Orders
      </MenuItem>
    </SidebarContainer>
  );
};

export default DependentSidebar;