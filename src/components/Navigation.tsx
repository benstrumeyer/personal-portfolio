import React, { useState, useEffect } from 'react';
import './Navigation.css';

interface NavigationProps {
  className?: string;
}

interface NavButton {
  label: string;
  href: string;
  leftIcon?: string;
  rightIcon?: string;
  target?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
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
      label: 'Resume',
      href: '/resume.pdf', // You can update this path
      target: 'https://benstrumeyer.github.io/portfolio//Ben_Strumeyer_Resume.pdf'
    },
    {
      label: 'Email',
      href: 'mailto:ben.strumeyer@gmail.com', // Update with your email
      target: '_self'
    },
    {
      label: 'Github',
      href: 'https://github.com/benstrumeyer', // Update with your GitHub
      target: '_blank'
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/ben-strumeyer-8aa897113', // Update with your LinkedIn
      target: '_blank'
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/ben_strumeyer', // Update with your Instagram
      target: '_blank'
    }
  ];

  return (
    <nav className={`navigation ${className} ${isVisible ? 'visible' : ''}`}>
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
          >
            <span>
              <span>{button.label}</span>
              <span aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
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
