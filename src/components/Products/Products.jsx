import React, { useState } from "react";
import styled from "styled-components";
import { Grid, List, Heart, Baby, GraduationCap, Shirt, Gamepad2, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import sampleProductImage from "../../../assets/sample-product.png";

// Export sampleProducts to make it available for import in ProductDetail.jsx

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 175px);
  margin-left: 175px; /* adjust based on your nav */
  padding: 20px;
  gap: 20px;
  box-sizing: border-box;
  height: calc(100vh - 60px); /* fill viewport minus header */
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const Sidebar = styled.div`
  width: 180px;
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 20px; /* sticks below header */
  align-self: flex-start;
`;

const SidebarSection = styled.div`
  margin-bottom: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
`;

const SectionTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  padding: 12px 15px;
  background-color: #f8f9fa;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background-color: #f0f1f2;
  }
  
  &::after {
    content: '▼';
    font-size: 12px;
    color: #666;
    transition: transform 0.2s ease;
    transform: ${props => props.isOpen ? 'rotate(0deg)' : 'rotate(-90deg)'};
  }
`;

const SectionContent = styled.div`
  padding: ${props => props.isOpen ? '15px' : '0 15px'};
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${props => props.isOpen ? '1' : '0'};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  margin-bottom: 8px;
  cursor: pointer;
`;

const Checkbox = styled.input`
  accent-color: #185c37;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
  padding-right: 8px; /* prevent scrollbar overlap */
  padding-bottom: 20px; /* ensure pagination is visible */
`;

const Header = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const Breadcrumb = styled.div`
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 20px;
`;

const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  background: #fff;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    color: #333;
  }

  &:hover svg {
    color: #185c37;
  }
`;

const Label = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const Select = styled.select`
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
`;

const ProductCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 10px;
  text-align: center;
  position: relative;
`;

const SaleTag = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #e63946;
  color: #fff;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 4px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: contain;
  margin-bottom: 10px;
`;

const ProductName = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
`;

const ProductPrice = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #185c37;
  margin-bottom: 10px;
`;

const AddButton = styled.button`
  width: 100%;
  background: #185c37;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #124a2c;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
`;

const PageButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: ${(props) => (props.active ? "#185c37" : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#333")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
`;

const sampleProducts = [
  { id: 1, name: "Paracetamol 500mg 24 Tablets", price: "R28.00", image: sampleProductImage, onSale: true, brand: "Clicks", description: "Paracetamol 500mg 24 tablets for effective pain relief and fever reduction.", ingredients: "Paracetamol 500mg" },
  { id: 2, name: "Ibuprofen 200mg 24 Tablets", price: "R35.00", image: sampleProductImage, onSale: false, brand: "Advil", description: "Ibuprofen 200mg 24 tablets for pain relief and anti-inflammatory effects.", ingredients: "Ibuprofen 200mg" },
  { id: 3, name: "Air Freshener", price: "R99.00", image: sampleProductImage, onSale: true, brand: "Airwick", description: "Long-lasting air freshener for a pleasant home environment.", ingredients: "Fragrance, Propellant" },
  { id: 4, name: "Baby Diapers Pack", price: "R120.00", image: sampleProductImage, onSale: false, brand: "Pampers", description: "Ultra-absorbent baby diapers for day and night protection.", ingredients: "Absorbent materials, Elastic" },
  { id: 5, name: "Vitamin C Supplements", price: "R85.00", image: sampleProductImage, onSale: true, brand: "Vital", description: "Vitamin C supplements to boost immune system and overall health.", ingredients: "Vitamin C, Zinc" },
  { id: 6, name: "Hand Sanitizer 500ml", price: "R45.00", image: sampleProductImage, onSale: false, brand: "Dettol", description: "Effective hand sanitizer that kills 99.9% of germs without water.", ingredients: "Alcohol, Glycerin" },
  { id: 7, name: "Face Masks Pack of 10", price: "R60.00", image: sampleProductImage, onSale: true, brand: "N95", description: "Protective face masks for daily use and protection.", ingredients: "Non-woven fabric, Elastic bands" },
  { id: 8, name: "Multivitamin Tablets", price: "R110.00", image: sampleProductImage, onSale: false, brand: "Centrum", description: "Complete multivitamin tablets with essential nutrients for daily health.", ingredients: "Vitamins A, B, C, D, E, Minerals" },
  { id: 9, name: "Baby Formula 900g", price: "R180.00", image: sampleProductImage, onSale: true, brand: "Nestle", description: "Nutritionally complete baby formula for healthy development.", ingredients: "Milk proteins, Vitamins, Minerals" },
  { id: 10, name: "Antiseptic Cream 50g", price: "R40.00", image: sampleProductImage, onSale: false, brand: "Savlon", description: "Antiseptic cream for minor cuts, burns and abrasions.", ingredients: "Cetrimide, Chlorhexidine" },
  { id: 11, name: "Cough Syrup 200ml", price: "R65.00", image: sampleProductImage, onSale: true, brand: "Benylin", description: "Effective cough syrup for relief from dry and tickly coughs.", ingredients: "Dextromethorphan, Menthol" },
  { id: 12, name: "Digital Thermometer", price: "R95.00", image: sampleProductImage, onSale: false, brand: "Clicks", description: "Accurate digital thermometer for temperature measurement.", ingredients: "N/A" },
];

const Products = () => {
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [openSections, setOpenSections] = useState({
    promotionType: true,
    category: true,
    shopByBrand: true
  });
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCategory = location.state?.category || 'Healthcare';

  // Category icon mapping
  const categoryIcons = {
    Healthcare: <Heart size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Babycare: <Baby size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    School: <GraduationCap size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Clothing: <Shirt size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Entertainment: <Gamepad2 size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />,
    Pregnancy: <Users size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />
  };

  const toggleSection = (sectionKey) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  return (
    <PageLayout>
      <ContentWrapper>
        {/* LEFT FILTER SIDEBAR */}
        <Sidebar>
        <SidebarSection>
          <SectionTitle 
            isOpen={openSections.promotionType}
            onClick={() => toggleSection('promotionType')}
          >
            Promotion Type
          </SectionTitle>
          <SectionContent isOpen={openSections.promotionType}>
            <CheckboxLabel>
              <Checkbox type="checkbox" /> Discount offers
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox type="checkbox" /> Mix and Match
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox type="checkbox" /> Bulk offers
            </CheckboxLabel>
          </SectionContent>
        </SidebarSection>

        <SidebarSection>
          <SectionTitle 
            isOpen={openSections.category}
            onClick={() => toggleSection('category')}
          >
            Category
          </SectionTitle>
          <SectionContent isOpen={openSections.category}>
            <CheckboxLabel>
              <Checkbox type="checkbox" /> Healthcare
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox type="checkbox" /> Babycare
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox type="checkbox" /> School
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox type="checkbox" /> Clothing
            </CheckboxLabel>
          </SectionContent>
        </SidebarSection>

        <SidebarSection>
          <SectionTitle 
            isOpen={openSections.shopByBrand}
            onClick={() => toggleSection('shopByBrand')}
          >
            Shop by Brand
          </SectionTitle>
          <SectionContent isOpen={openSections.shopByBrand}>
            <CheckboxLabel>
              <Checkbox type="checkbox" /> Cal-C-Vita
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox type="checkbox" /> Clicks Expert
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox type="checkbox" /> Ensure
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox type="checkbox" /> Biogen
            </CheckboxLabel>
          </SectionContent>
        </SidebarSection>
      </Sidebar>

        {/* RIGHT MAIN PRODUCT CATALOG */}
        <MainContent>
          <Header>{categoryIcons[selectedCategory]}{selectedCategory} Products </Header>
          
          <FiltersRow>
          <FilterGroup>
            <Label>Sort By</Label>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Show</Label>
            <Select>
              <option value="20">20 per page</option>
              <option value="40">40 per page</option>
              <option value="60">60 per page</option>
            </Select>
          </FilterGroup>

          {/* NEW ICONS ON RIGHT */}
          <IconsGroup>
            <IconButton><Grid /></IconButton>
            <IconButton><List /></IconButton>
          </IconsGroup>
        </FiltersRow>

        <ProductGrid>
          {sampleProducts.map((p) => (
            <ProductCard key={p.id} onClick={() => navigate(`/product/${p.id}`)}>
              {p.onSale && <SaleTag>-10%</SaleTag>}
              <ProductImage src={p.image} alt={p.name} />
              <ProductName>{p.name}</ProductName>
              <ProductPrice>{p.price}</ProductPrice>
              <AddButton onClick={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking the button
                // Add to basket logic here
              }}>Add To Basket</AddButton>
            </ProductCard>
          ))}
        </ProductGrid>

        <Pagination>
          <PageButton active={currentPage === 1}>1</PageButton>
          <PageButton>2</PageButton>
          <PageButton>3</PageButton>
          <PageButton>4</PageButton>
          <PageButton>Last</PageButton>
        </Pagination>
        </MainContent>
      </ContentWrapper>
    </PageLayout>
  );
};

export default Products;
export { sampleProducts };
