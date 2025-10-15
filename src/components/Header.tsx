import React from 'react';
import './Header.css';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`site-header ${className}`}>
      <h1 className="header-name">Ben Strumeyer</h1>
      <h2 className="header-title">- Creative Developer</h2>
    </header>
  );
};

export default Header;
