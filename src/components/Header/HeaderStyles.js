// Add this shared styled component for all headers
const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 40px 0px 60px;
  width: calc(100% - 280px); /* Updated to match sidebar width */
  margin-left: 280px; /* Updated to match sidebar width */
  box-sizing: border-box;
  background: white;
  border-bottom: 1px solid #eee;
  font-family: 'Poppins', sans-serif;
  height: 60px;
  z-index: 99;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
`;