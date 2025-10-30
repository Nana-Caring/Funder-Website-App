import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import healthcareIcon from '../../assets/icons/healthcare.png';
import clothingIcon from '../../assets/icons/clothing.png';
import schoolIcon from '../../assets/icons/school.png';
import babycareIcon from '../../assets/icons/babycare.png';
import entertainmentIcon from '../../assets/icons/entertainment.png';
import pregnancyIcon from '../../assets/icons/pregnancy.png';
// Additional icons for backend categories
import buyIcon from '../../assets/icons/buy.png'; // For Groceries
import trackIcon from '../../assets/icons/track.png'; // For Transport
import setupIcon from '../../assets/icons/setup.png'; // For Other

const BACKEND_CATEGORIES = ['Healthcare', 'Education', 'Groceries', 'Transport', 'Entertainment', 'Other'];

const CATEGORY_ICONS = {
  Healthcare: <img src={healthcareIcon} alt="Healthcare" width={40} height={40} style={{borderRadius: '50%'}} />,
  Education: <img src={schoolIcon} alt="Education" width={40} height={40} style={{borderRadius: '50%'}} />,
  Groceries: <img src={buyIcon} alt="Groceries" width={40} height={40} style={{borderRadius: '50%'}} />,
  Transport: <img src={trackIcon} alt="Transport" width={40} height={40} style={{borderRadius: '50%'}} />,
  Entertainment: <img src={entertainmentIcon} alt="Entertainment" width={40} height={40} style={{borderRadius: '50%'}} />,
  Other: <img src={setupIcon} alt="Other" width={40} height={40} style={{borderRadius: '50%'}} />,
  // Legacy frontend labels mapped for completeness (not shown unless desired)
  Clothing: <img src={clothingIcon} alt="Clothing" width={40} height={40} style={{borderRadius: '50%'}} />,
  School: <img src={schoolIcon} alt="School" width={40} height={40} style={{borderRadius: '50%'}} />,
  Babycare: <img src={babycareIcon} alt="Babycare" width={40} height={40} style={{borderRadius: '50%'}} />,
  Pregnancy: <img src={pregnancyIcon} alt="Pregnancy" width={40} height={40} style={{borderRadius: '50%'}} />,
};

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

const DependentBuy = () => {
  const navigate = useNavigate();
  const authUser = useSelector(state => state.authentication?.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allowedCategories, setAllowedCategories] = useState(BACKEND_CATEGORIES);

  useEffect(() => {
    const fetchAllowedCategories = async () => {
      if (!authUser?.role || authUser.role.toLowerCase() !== 'dependent' || !authUser?.id) {
        // Non-dependent: show full set
        setAllowedCategories(BACKEND_CATEGORIES);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const BASE_URL = 'https://nanacaring-backend.onrender.com/api';
        // Pull enough items to sample all categories the backend allows for this dependent
        const res = await fetch(`${BASE_URL}/products/dependent/${authUser.id}?limit=200`, { headers });
        const data = await res.json();
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || `HTTP ${res.status}`);
        }
        const items = Array.isArray(data.data) ? data.data : [];
        const cats = Array.from(new Set(items.map(p => p.category).filter(Boolean)));
        // Keep only known backend categories and preserve desired order
        const filtered = BACKEND_CATEGORIES.filter(c => cats.includes(c));
        setAllowedCategories(filtered.length > 0 ? filtered : BACKEND_CATEGORIES);
      } catch (e) {
        console.error('Failed to fetch age-allowed categories:', e);
        setError(e.message);
        setAllowedCategories(BACKEND_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    fetchAllowedCategories();
  }, [authUser?.role, authUser?.id]);
  
  const handleCategoryClick = (category) => {
    navigate('/products', { state: { category } });
  };
  
  const displayCategories = useMemo(() => {
    return allowedCategories.map(label => ({ label, icon: CATEGORY_ICONS[label] }));
  }, [allowedCategories]);

  return (
    <Container>
      <Title>Please Choose the products category</Title>
      {loading && (
        <div style={{ textAlign: 'center', marginBottom: '12px', color: '#666' }}>Loading age-allowed categories…</div>
      )}
      {error && (
        <div style={{ textAlign: 'center', marginBottom: '12px', color: '#b00020' }}>Using default categories: {error}</div>
      )}
      <Grid>
        {displayCategories.map((cat) => (
          <Card key={cat.label} onClick={() => handleCategoryClick(cat.label)}>
            {cat.icon}
            <Label>{cat.label}</Label>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default DependentBuy;