import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import logo from '../../assets/logo.png';

const LoaderOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LogoContainer = styled.div`
  margin-bottom: 20px;

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled.div`
  margin-top: 14px;
  color: #185c37;
  font-size: 14px;
  text-align: center;
`;

const Loader = () => {
  const message = useSelector((state) => state.ui?.message);
  return (
    <LoaderOverlay>
      <LogoContainer>
        <img src={logo} alt="Nana Logo" />
      </LogoContainer>
      <Spinner />
      {message ? <Message>{message}</Message> : null}
    </LoaderOverlay>
  );
};

export default Loader;