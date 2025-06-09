import styled from 'styled-components';

export const ScrollableContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  margin-left: 200px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
    &:hover { background: #555; }
  }
`;

export const SettingsHeader = styled.div`
  background: #185c37;
  color: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;

  h1 {
    margin: 0;
    font-size: 24px;
  }
  p {
    margin: 8px 0 0;
    opacity: 0.9;
  }
`;

export const SettingsCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 20px;
`;

export const SettingItem = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

export const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;

    &:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: #185c37;
  }

  input:checked + span:before {
    transform: translateX(26px);
  }
`;