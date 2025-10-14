import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import logo from '../../assets/logo.png';

const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${props => props.$isVisible ? 1 : 0};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
`;

const LogoContainer = styled.div`
  animation: scaleUp 2s ease-in-out infinite;
  margin-bottom: 20px;

  @keyframes scaleUp {
    0% {
      transform: scale(0.8);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(0.8);
    }
  }

  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const AppName = styled.h1`
  color: #FFA500;
  font-size: 24px;
  margin-top: 16px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
`;

const LoadingText = styled.p`
  color: #666;
  margin-top: 8px;
  font-family: 'Poppins', sans-serif;
`;

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onFinish?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <SplashContainer $isVisible={isVisible}>
      <LogoContainer>
        <img src={logo} alt="NANA Caring Logo" />
      </LogoContainer>
    </SplashContainer>
  );
};

export default SplashScreen;