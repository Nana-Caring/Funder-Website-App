import styled from 'styled-components';

export const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-start; // Changed from space-between
  align-items: center;
  padding: 0px 40px 0px 60px;
  width: calc(100% - 270px);
  margin-left: 280px;
  box-sizing: border-box;
  background: white;
  border-bottom: 1px solid #eee;
  font-family: 'Poppins', sans-serif;
  height: 60px;
//   z-index: 99;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

  h2 {
    font-size: 16px;
    color: #333;
    margin: 0;
  }

  .icons {
    margin-left: auto; // This will push icons to the right
    display: flex;
    gap: 12px;
    align-items: center;

    .icon-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      position: relative;
      cursor: pointer;

      img {
        width: 20px;
        height: 20px;
        object-fit: contain;
      }

      .notification-indicator {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 8px;
        height: 8px;
      }

      span {
        font-size: 11px;
        color: #666;
      }
    }
  }

  @media (max-width: 1024px) {
    width: calc(100% - 200px);
    padding: 8px 30px 8px 40px;
    
    h2 {
      font-size: 15px;
    }
  }

  @media (max-width: 768px) {
    width: calc(100% - 180px);
    padding: 8px 20px 8px 30px;
    
    .icons {
      gap: 8px;
      
      .icon-container img {
        width: 18px;
        height: 18px;
      }
    }
  }
`;