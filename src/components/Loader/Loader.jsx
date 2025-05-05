import React from 'react';
import styled from 'styled-components';
import logo from '../../assets/logo.jpg';

const LoaderOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LogoContainer = styled.div`
  animation: spin 2s linear infinite;
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const Loader = () => {
  return (
    <LoaderOverlay>
      <LogoContainer>
        <img src={logo} alt="Loading..." />
      </LogoContainer>
    </LoaderOverlay>
  );
};

export default Loader;