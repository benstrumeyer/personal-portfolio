import React, { useState, useEffect, useCallback } from 'react';
import { EXTERNAL_URLS, SVG_NAMESPACE } from '../constants/urls';
import { useMediaQuery } from '../hooks/useMediaQuery';
import './Navigation.css';

interface NavigationProps {
  className?: string;
  onContactClick?: (event: React.MouseEvent) => void;
  onHobbiesClick?: () => void;
  isModalOpen?: boolean;
}

interface NavButton {
  label: string;
  href: string;
  leftIcon?: string | React.ReactNode;
  rightIcon?: string;
  target?: string;
  onClick?: (() => void) | undefined;
}

const Navigation: React.FC<NavigationProps> = ({ className = '', onContactClick, onHobbiesClick, isModalOpen = false }) => {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const headerText = "Ben Strumeyer";
  const isMobile = useMediaQuery('(max-width: 1023px)');

  // Start letter reveal animation when navigation becomes visible
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (className === 'visible') {
      const totalLetters = headerText.length;
      const revealSpeed = 50; // milliseconds per letter
      
      const revealLetters = () => {
        setVisibleLetters(prev => {
          if (prev < totalLetters) {
            timeoutId = setTimeout(revealLetters, revealSpeed);
            return prev + 1;
          }
          return prev;
        });
      };
      
      // Start animation after a short delay
      timeoutId = setTimeout(revealLetters, 200);
    } else {
      // Reset when hidden
      setVisibleLetters(0);
    }
    
    // Cleanup timeout on unmount or dependency change
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [className, headerText.length]);

  // Feature flag for hobbies section (development mode)
  const showHobbies = import.meta.env['VITE_SHOW_HOBBIES'] === 'true';

  const buttons: NavButton[] = [
    {
      label: 'Connect',
      href: '#',
      target: '_self',
      leftIcon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
          <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
        </svg>
      )
    },
    {
      label: 'Resume',
      href: EXTERNAL_URLS.RESUME,
      target: '_blank',
      leftIcon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" opacity="0.8"/>
          <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" opacity="0.8"/>
          <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" opacity="0.8"/>
        </svg>
      )
    },
    {
      label: 'Github',
      href: EXTERNAL_URLS.GITHUB,
      target: '_blank',
      leftIcon: (
        <svg width="20" height="20" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="currentColor" opacity="0.8"/>
        </svg>
      )
    },
    {
      label: 'LinkedIn',
      href: EXTERNAL_URLS.LINKEDIN,
      target: '_blank',
      leftIcon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 8C18.2 8 20 9.8 20 12V21H16V12C16 11.4 15.6 11 15 11C14.4 11 14 11.4 14 12V21H10V8H14V9.3C14.4 8.6 15.2 8.2 16 8Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
          <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
          <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
        </svg>
      )
    },
    {
      label: 'Instagram',
      href: EXTERNAL_URLS.INSTAGRAM,
      target: '_blank',
      leftIcon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" opacity="0.8"/>
        </svg>
      )
    },
    // Conditionally include Hobbies button based on feature flag
    ...(showHobbies ? [{
      label: 'Hobbies',
      href: '#',
      target: '_self',
      onClick: onHobbiesClick,
      leftIcon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
          <path d="M19 15L20.09 18.26L23 19L20.09 19.74L19 23L17.91 19.74L15 19L17.91 18.26L19 15Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
          <path d="M5 15L6.09 18.26L9 19L6.09 19.74L5 23L3.91 19.74L1 19L3.91 18.26L5 15Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
        </svg>
      )
    }] : [])
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
                {char === ' ' ? '\u00A0' : char}
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
                {char === ' ' ? '\u00A0' : char}
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
            download={button.label === 'Resume' ? 'Ben_Strumeyer_Resume.pdf' : undefined}
            className="nav-button"
            onClick={button.label === 'Connect' ? (e) => {
              e.preventDefault();
              if (onContactClick) {
                onContactClick(e);
              }
            } : button.label === 'Hobbies' ? (e) => {
              e.preventDefault();
              if (button.onClick) {
                button.onClick();
              }
            } : undefined}
          >
            <span>
              <span className="left-icon" aria-hidden="true">
                {typeof button.leftIcon === 'string' ? button.leftIcon : button.leftIcon}
              </span>
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
