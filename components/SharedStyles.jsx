import styled from 'styled-components';

export const PageContainer = styled.div`
  margin-left: 250px;
  width: calc(100% - 250px);
  min-height: calc(100vh - 60px);
  padding: 80px 24px 24px;
  background: #f8f9fa;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    margin-left: 200px;
    width: calc(100% - 200px);
  }

  @media (max-width: 768px) {
    margin-left: 180px;
    width: calc(100% - 180px);
    padding: 70px 16px 16px;
  }
`;