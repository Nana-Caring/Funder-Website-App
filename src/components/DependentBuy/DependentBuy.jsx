import React, { useEffect, useMemo, useState } from 'react';
import { List } from 'lucide-react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../store/slices/ui';
import healthcareIcon from '../../assets/icons/healthcare.png';
import clothingIcon from '../../assets/icons/clothing.png';
import schoolIcon from '../../assets/icons/school.png';
import babycareIcon from '../../assets/icons/babycare.png';
import entertainmentIcon from '../../assets/icons/entertainment.png';
import pregnancyIcon from '../../assets/icons/pregnancy.png';
// Additional icons for backend categories
import cartIcon from '../../../assets/icons/cart.png'; // For Groceries (updated)

// Public base categories exclude Pregnancy by default; Pregnancy is conditional per eligibility
const PUBLIC_BASE_CATEGORIES = ['Healthcare', 'Education', 'Groceries', 'Entertainment', 'Other'];
const BACKEND_CATEGORIES = ['Healthcare', 'Education', 'Groceries', 'Pregnancy', 'Entertainment', 'Other'];

const CATEGORY_DESCRIPTIONS = {
  Pregnancy: 'Pregnavit M 30 Capsules are formulated for women before, during and after pregnancy. It combines folic acid and a range of essential vitamins and minerals to improve energy, maintain healthy cells, and promote strong bones and teeth.'
};

const CATEGORY_ICONS = {
  Healthcare: <img src={healthcareIcon} alt="Healthcare" width={40} height={40} />,
  Education: <img src={schoolIcon} alt="Education" width={40} height={40} />,
  // Use contain + padding to ensure full visibility of the cart icon inside the circular mask
  Groceries: <img src={cartIcon} alt="Groceries" width={40} height={40} style={{ objectFit: 'contain' }} />,
  Pregnancy: <img src={pregnancyIcon} alt="Pregnancy" width={40} height={40} />,
  Entertainment: <img src={entertainmentIcon} alt="Entertainment" width={40} height={40} />,
  // Use a list icon for "Other" with no circular background
  Other: (<List size={28} color="#185c37" />),
  // Legacy frontend labels mapped for completeness (not shown unless desired)
  Clothing: <img src={clothingIcon} alt="Clothing" width={40} height={40} />,
  School: <img src={schoolIcon} alt="School" width={40} height={40} />,
  Babycare: <img src={babycareIcon} alt="Babycare" width={40} height={40} />,
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
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover {
    box-shadow: ${props => props.disabled ? '0 2px 8px rgba(0,0,0,0.04)' : '0 4px 16px rgba(0,0,0,0.10)'};
  }

  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
`;

const ComingSoonBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 2;
  text-transform: uppercase;
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
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allowedCategories, setAllowedCategories] = useState([]);

  const fetchAllowedCategories = React.useCallback(async () => {
    setLoading(true);
    dispatch(showLoading({ message: 'Loading categories…' }));
    setError(null);

    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('token');
    const hasAuth = Boolean(token);
    const headers = hasAuth
      ? { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      : { Accept: 'application/json' };
    const BASE_URL = 'https://nanacaring-backend.onrender.com/api/products';

    // Decide which endpoint to call per spec
    let url = `${BASE_URL}/categories`; // public default (no Pregnancy)
    const role = authUser?.role?.toLowerCase();
    const userId = authUser?.id;

    try {
      if (hasAuth && authUser && userId && role) {
        if (role === 'dependent') {
          // Age-appropriate categories for dependent (Pregnancy included only if eligible)
          url = `${BASE_URL}/dependent/${userId}/categories`;
        } else {
          // User-specific categories (Pregnancy included only if eligible)
          url = `${BASE_URL}/user/${userId}/categories`;
        }
      }

      const res = await fetch(url, { headers });

      // Validate content-type; backend occasionally returns HTML on errors
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        // Log detailed reason but avoid exposing raw detail to end-user
        console.warn('Unexpected content-type for categories:', contentType);
        throw new Error('Unable to fetch categories from server');
      }

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || `HTTP ${res.status}`);
      }

      // Map categories from response objects
      const categories = Array.isArray(data.data)
        ? data.data
            .map((c) => (typeof c === 'string' ? c : c?.category))
            .filter(Boolean)
        : [];

      // Fallback if API returned empty list for some reason
      if (!categories.length) {
        setAllowedCategories(PUBLIC_BASE_CATEGORIES);
      } else {
        setAllowedCategories(categories);
      }
    } catch (e) {
      console.error('Failed to fetch categories:', e);
      setError(e.message);
      // Safe default: show public base categories (exclude Pregnancy by default)
      setAllowedCategories(PUBLIC_BASE_CATEGORIES);
    } finally {
      setLoading(false);
      dispatch(hideLoading());
    }
  }, [authUser?.role, authUser?.id, dispatch]);

  useEffect(() => {
    fetchAllowedCategories();
  }, [fetchAllowedCategories]);
  
  const handleCategoryClick = (category) => {
    // Disable navigation for Healthcare and Education - coming soon
    if (category === 'Healthcare' || category === 'Education') {
      return;
    }
    navigate('/products', { state: { category } });
  };
  
  const displayCategories = useMemo(() => {
    return allowedCategories.map(label => ({ label, icon: CATEGORY_ICONS[label] }));
  }, [allowedCategories]);

  return (
    <Container>
      <Title>Please Choose the products category</Title>
      {!loading && (
        <>
          {error && (
            <div style={{ textAlign: 'center', marginBottom: '12px', color: '#b00020' }}>
              Showing base categories for now. Some personalized categories may be unavailable.
            </div>
          )}
          <Grid>
            {displayCategories.map((cat) => {
              const isComingSoon = cat.label === 'Healthcare' || cat.label === 'Education';
              return (
                <Card
                  key={cat.label}
                  disabled={isComingSoon}
                  onClick={() => handleCategoryClick(cat.label)}
                  title={isComingSoon ? 'Coming Soon' : (CATEGORY_DESCRIPTIONS[cat.label] || '')}
                >
                  {isComingSoon && <ComingSoonBadge>Coming Soon</ComingSoonBadge>}
                  {cat.icon}
                  <Label>{cat.label}</Label>
                </Card>
              );
            })}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default DependentBuy;