import React, { useState, useEffect } from 'react';
import { EXTERNAL_URLS, SVG_NAMESPACE } from '../constants/urls';
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
  const [isVisible, setIsVisible] = useState(false);

  // Fade in animation on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500); // Start fade-in after 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  const buttons: NavButton[] = [
    {
      label: 'Contact',
      href: '#',
      target: '_self'
    },
    {
      label: 'Resume',
      href: EXTERNAL_URLS.RESUME,
      target: '_blank'
    },
    {
      label: 'Github',
      href: EXTERNAL_URLS.GITHUB,
      target: '_blank'
    },
    {
      label: 'LinkedIn',
      href: EXTERNAL_URLS.LINKEDIN,
      target: '_blank'
    },
    {
      label: 'Instagram',
      href: EXTERNAL_URLS.INSTAGRAM,
      target: '_blank'
    }
  ];

  return (
    <nav className={`navigation ${className} ${isVisible ? 'visible' : ''} ${isModalOpen ? 'modal-open' : ''}`}>
      <div className="nav-buttons">
        {buttons.map((button, index) => (
          <a
            key={button.label}
            href={button.href}
            target={button.target}
            rel={button.target === '_blank' ? 'noopener noreferrer' : undefined}
            className="nav-button"
            style={{ 
              animationDelay: `${index * 0.2}s` // Stagger the fade-in animations with more delay
            }}
            onClick={button.label === 'Contact' ? (e) => {
              e.preventDefault();
              if (onContactClick) {
                onContactClick(e);
              }
            } : undefined}
          >
            <span>
              <span>{button.label}</span>
              <span aria-hidden="true">
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
