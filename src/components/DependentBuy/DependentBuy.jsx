import React from 'react';
import styled from 'styled-components';
import healthcareIcon from '../../assets/icons/healthcare.png';
import clothingIcon from '../../assets/icons/clothing.png';
import schoolIcon from '../../assets/icons/school.png';
import babycareIcon from '../../assets/icons/babycare.png';
import entertainmentIcon from '../../assets/icons/entertainment.png';
import pregnancyIcon from '../../assets/icons/pregnancy.png';

const categories = [
  { label: 'Healthcare', icon: (
    <img src={healthcareIcon} alt="Healthcare" width={40} height={40} style={{borderRadius: '50%'}} />
  ) },
  { label: 'Clothing', icon: (
    <img src={clothingIcon} alt="Clothing" width={40} height={40} style={{borderRadius: '50%'}} />
  ) },
  { label: 'School', icon: (
    <img src={schoolIcon} alt="School" width={40} height={40} style={{borderRadius: '50%'}} />
  ) },
  { label: 'Babycare', icon: (
    <img src={babycareIcon} alt="Babycare" width={40} height={40} style={{borderRadius: '50%'}} />
  ) },
  { label: 'Entertainment', icon: (
    <img src={entertainmentIcon} alt="Entertainment" width={40} height={40} style={{borderRadius: '50%'}} />
  ) },
  { label: 'Pregnancy', icon: (
    <img src={pregnancyIcon} alt="Pregnancy" width={40} height={40} style={{borderRadius: '50%'}} />
  ) },
];

const Container = styled.div`
 display: flex;
  flex-direction: column;
  width: 90%;
  margin-top: -40px;
  height: calc(100vh - 60px); /* Adjust height to fill the viewport minus header */
  overflow: hidden;
  position: relative;
  margin-left: 175px; /* Adjust this value to match the width of the sidebar */
  
`;

const Title = styled.h2`
  color: #185c37;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 30px;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0 8px 0;
  cursor: pointer;
  transition: box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const Label = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #185c37;
  text-align: center;
  font-weight: 500;
  padding: 0 4px;
`;

const DependentBuy = () => (
  <Container>
    <Title>Please Choose the products category</Title>
    <Grid>
      {categories.map((cat) => (
        <Card key={cat.label}>
          {cat.icon}
          <Label>{cat.label}</Label>
        </Card>
      ))}
    </Grid>
  </Container>
);

export default DependentBuy;