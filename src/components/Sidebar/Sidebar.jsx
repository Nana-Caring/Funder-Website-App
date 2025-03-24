import React from 'react';
import styled from 'styled-components';
import logo from '../../assets/logo.jpg';
import homeIcon from '../../assets/icons/home-icon.png';
import depositIcon from '../../assets/icons/deposit-icon.png';
import myAccountIcon from '../../assets/icons/my-account-icon.png';
import sendMoneyIcon from '../../assets/icons/send-money-icon.png';
import beneficiaryIcon from '../../assets/icons/beneficiary-icon.png';
import statementsIcon from '../../assets/icons/statements-icon.png';

const SidebarContainer = styled.div`
  width: 235px;
  height: 150vh;
  background-color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-right: 2px solid gray;
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

const MenuItem = styled.div`
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

const Sidebar = () => {
  return (
    <SidebarContainer>
      <Logo>
        <img src={logo} alt="Nana" width="118" height="101" />
        
      </Logo>

      <MenuItem active>
        <img src={homeIcon} alt="Home" />
        Home
      </MenuItem>

      <MenuItem>
        <img src={depositIcon} alt="Deposit Money" />
        Deposit Money
      </MenuItem>

      <MenuItem>
        <img src={myAccountIcon} alt="My Accounts" />
        My Accounts
      </MenuItem>

      <MenuItem>
        <img src={sendMoneyIcon} alt="Send Money" />
        Send Money
      </MenuItem>

      <MenuItem>
        <img src={beneficiaryIcon} alt="Beneficiary" />
        Beneficiary
      </MenuItem>

      <MenuItem>
        <img src={statementsIcon} alt="Statements" />
        Statements
      </MenuItem>
    </SidebarContainer>
  );
};

export default Sidebar;