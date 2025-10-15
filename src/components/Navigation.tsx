import React, { useState, useEffect } from 'react';
import { EXTERNAL_URLS, SVG_NAMESPACE } from '../constants/urls';
import { useMediaQuery } from '../hooks/useMediaQuery';
import './Navigation.css';

interface NavigationProps {
  className?: string;
  onContactClick?: (event: React.MouseEvent) => void;
  isModalOpen?: boolean;
}

interface NavButton {
  label: string;
  href: string;
  leftIcon?: string;
  rightIcon?: string;
  target?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = '', onContactClick, isModalOpen = false }) => {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const headerText = "Ben Strumeyer";
  const isMobile = useMediaQuery('(max-width: 1023px)');

  // Start letter reveal animation when navigation becomes visible
  useEffect(() => {
    if (className === 'visible') {
      const totalLetters = headerText.length;
      const revealSpeed = 50; // milliseconds per letter
      
      const revealLetters = () => {
        setVisibleLetters(prev => {
          if (prev < totalLetters) {
            setTimeout(revealLetters, revealSpeed);
            return prev + 1;
          }
          return prev;
        });
      };
      
      // Start animation after a short delay
      setTimeout(revealLetters, 200);
    } else {
      // Reset when hidden
      setVisibleLetters(0);
    }
  }, [className, headerText.length]);

  const buttons: NavButton[] = [
    {
      label: 'Connect',
      href: '#',
      target: '_self',
      leftIcon: '📧'
    },
    {
      label: 'Resume',
      href: EXTERNAL_URLS.RESUME,
      target: '_blank',
      leftIcon: '📄'
    },
    {
      label: 'Github',
      href: EXTERNAL_URLS.GITHUB,
      target: '_blank',
      leftIcon: '🐙'
    },
    {
      label: 'LinkedIn',
      href: EXTERNAL_URLS.LINKEDIN,
      target: '_blank',
      leftIcon: '💼'
    },
    {
      label: 'Instagram',
      href: EXTERNAL_URLS.INSTAGRAM,
      target: '_blank',
      leftIcon: '📷'
    }
  ];

  return (
    <nav className={`navigation ${className} ${isModalOpen ? 'modal-open' : ''}`}>
      {/* Header title above buttons - Mobile only */}
      {isMobile && (
        <div className="nav-header">
          <h1 className="header-title">
            {headerText.split('').map((char, index) => (
              <span 
                key={index} 
                className={`letter ${index < visibleLetters ? 'visible' : ''}`}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>
      )}

      {/* Top-left name - Desktop only */}
      {!isMobile && className === 'visible' && (
        <div className="top-left-name">
          <h1 className="name-title">
            {headerText.split('').map((char, index) => (
              <span 
                key={index} 
                className={`letter ${index < visibleLetters ? 'visible' : ''}`}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>
      )}
      
      <div className="nav-buttons">
        {buttons.map((button) => (
          <a
            key={button.label}
            href={button.href}
            target={button.target}
            rel={button.target === '_blank' ? 'noopener noreferrer' : undefined}
            className="nav-button"
            onClick={button.label === 'Connect' ? (e) => {
              e.preventDefault();
              if (onContactClick) {
                onContactClick(e);
              }
            } : undefined}
          >
            <span>
              <span className="left-icon" aria-hidden="true">{button.leftIcon}</span>
              <span className="button-text">{button.label}</span>
              <span className="right-icon" aria-hidden="true">
                <svg xmlns={SVG_NAMESPACE} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </span>
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
