import React, { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { gsap } from 'gsap';
import './WelcomeScreen.css';

interface WelcomeScreenProps {
  onDismiss: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [visibleLetters, setVisibleLetters] = useState(0);

  const isMobile = useMediaQuery('(max-width: 1023px)');
  
  // Refs for GSAP animations
  const welcomeContentRef = useRef<HTMLDivElement>(null);
  const clickHintRef = useRef<HTMLDivElement>(null);

  // Text content - same for mobile and desktop
  const paragraphs = [
    "Hi. I'm Ben Strumeyer.",
    "This is my personal portfolio where you can learn more about me.",
    "Hit the connect button if you want to chat!"
  ];

  // Start the letter fade-in animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Calculate total letters across all paragraphs
      const totalLetters = paragraphs.join(' ').length;
      const revealSpeed = 50; // milliseconds per letter (slower for smoother effect)
      
      const revealLetters = () => {
        setVisibleLetters(prev => {
          if (prev < totalLetters) {
            setTimeout(revealLetters, revealSpeed);
            return prev + 1;
          }
          return prev;
        });
      };
      
      revealLetters();
      
    }, 300);

    return () => clearTimeout(timer);
  }, [paragraphs]);

  // Render paragraphs with letter animation
  const renderParagraphs = () => {
    let currentLetterIndex = 0;
    
    return paragraphs.map((paragraph, paragraphIndex) => {
      const paragraphLetters = paragraph.split('');
      
      return (
        <p key={paragraphIndex} className="welcome-paragraph">
          {paragraphLetters.map((char, charIndex) => {
            const globalIndex = currentLetterIndex + charIndex;
            const isVisible = globalIndex < visibleLetters;
            
            return (
              <span 
                key={charIndex} 
                className={`letter ${isVisible ? 'visible' : ''}`}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </p>
      );
      
      currentLetterIndex += paragraph.length + 1; // +1 for space between paragraphs
    });
  };

  // Handle click to dismiss (both mobile and desktop)
  const handleClick = () => {
    if (!isDismissed && visibleLetters >= paragraphs.join(' ').length) {
      setIsDismissed(true);
      
      // Fade out animation
      const tl = gsap.timeline();
      
      // Fade out the entire welcome screen
      tl.to('.welcome-screen', {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      })
      // Hide welcome screen after animation completes
      .call(() => {
        setTimeout(() => {
          onDismiss();
        }, 100);
      });
    }
  };


  return (
    <div className={`welcome-screen ${isVisible ? 'visible' : ''} ${isDismissed ? 'dismissed' : ''}`} onClick={handleClick}>
      {/* Mobile Welcome Screen */}
      {isMobile && (
        <>
          <div ref={welcomeContentRef} className="welcome-content">
            <div className="welcome-text">
              <div className="welcome-text-content">
                {renderParagraphs()}
              </div>
            </div>
          </div>
          
          {/* Mobile click hint */}
          {!isDismissed && visibleLetters >= paragraphs.join(' ').length && (
            <div ref={clickHintRef} className="click-hint">
              <p>Click anywhere to continue</p>
            </div>
          )}
        </>
      )}

      {/* Desktop Welcome Screen */}
      {!isMobile && (
        <>
          <div ref={welcomeContentRef} className={`desktop-welcome ${isDismissed ? 'fade-out' : ''}`}>
            <div className="welcome-text-content">
              {renderParagraphs()}
            </div>
          </div>
          
          {/* Desktop click hint */}
          {!isDismissed && visibleLetters >= paragraphs.join(' ').length && (
            <div ref={clickHintRef} className="click-hint">
              <p>Click anywhere to continue</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WelcomeScreen;
