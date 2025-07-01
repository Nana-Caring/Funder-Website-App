import styled from 'styled-components';

export const ScrollableContainer = styled.div`
  height: calc(100vh - 80px);
  overflow-y: auto;
  padding: 20px;
  margin-left: 280px;
  
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

export const ProfileWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

export const ProfileHeader = styled.div`
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

export const ProfileCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 20px;
`;

export const Section = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    color: #185c37;
    font-size: 18px;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #f0f0f0;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  label {
    display: block;
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
  }

  p {
    font-size: 16px;
    color: #333;
    margin: 0;
  }

  .value-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    .edit-icon {
      width: 16px;
      height: 16px;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }
  }
`;

export const FileUpload = styled.div`
  padding: 20px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  text-align: center;
  background: #fafafa;
`;

export const UploadButton = styled.button`
  background: #185c37;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: #0f3e24;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;