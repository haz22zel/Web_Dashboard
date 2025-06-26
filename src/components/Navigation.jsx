import React, { useState } from 'react';
import styled from 'styled-components';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(24, 26, 32, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.1em;
`;

const NavMenu = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled.a`
  color: ${props => props.active ? '#c084fc' : '#b0b8c1'};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
  cursor: pointer;
  
  &:hover {
    color: #c084fc;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: ${props => props.active ? '100%' : '0%'};
    height: 2px;
    background: linear-gradient(90deg, #ff6ac1, #38bdf8);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

function Navigation() {
  const [activeMenu, setActiveMenu] = useState('Home');

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <NavContainer>
      <Logo>ASTRA</Logo>
      <NavMenu>
        <NavItem>
          <NavLink 
            active={activeMenu === 'Home'} 
            onClick={() => handleMenuClick('Home')}
          >
            Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink 
            active={activeMenu === 'Dashboard'} 
            onClick={() => handleMenuClick('Dashboard')}
          >
            Dashboard
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink 
            active={activeMenu === 'Archive'} 
            onClick={() => handleMenuClick('Archive')}
          >
            Archive
          </NavLink>
        </NavItem>
      </NavMenu>
    </NavContainer>
  );
}

export default Navigation; 