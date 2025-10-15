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

  const isMobile = useMediaQuery('(max-width: 1023px)');
  
  // Refs for GSAP animations
  const welcomeContentRef = useRef<HTMLDivElement>(null);
  const clickHintRef = useRef<HTMLDivElement>(null);
  
  // Individual refs for each sentence
  const sentence1Ref = useRef<HTMLDivElement>(null);
  const sentence2Ref = useRef<HTMLDivElement>(null);

  // Text content split into characters
  const sentence1 = "Hi, I'm Ben Strumeyer.".split('');
  const sentence2 = "Hit the connect button if you want to chat!".split('');

  // Refs for each character
  const sentence1Chars = useRef<(HTMLSpanElement | null)[]>([]);
  const sentence2Chars = useRef<(HTMLSpanElement | null)[]>([]);

  // Animation function
  const startAnimation = () => {
    setIsVisible(true);
    
    // Wait for DOM to be ready
    setTimeout(() => {
      // Create a timeline
      const tl = gsap.timeline();
      
      // Initially hide click hint
      tl.set(clickHintRef.current, { opacity: 0 });
      
      // Animate sentence 1 character by character
      sentence1Chars.current.forEach((charRef, index) => {
        if (charRef) {
          tl.to(charRef, {
            opacity: 1,
            duration: 0.03,
            ease: "none"
          }, index * 0.03);
        }
      });
      
      // Pause between sentences
      tl.to({}, { duration: 0.3 });
      
      // Animate sentence 2 character by character (starting after pause)
      const sentence1Duration = sentence1Chars.current.length * 0.03;
      sentence2Chars.current.forEach((charRef, index) => {
        if (charRef) {
          tl.to(charRef, {
            opacity: 1,
            duration: 0.03,
            ease: "none"
          }, sentence1Duration + 0.3 + index * 0.03);
        }
      });
      
      // Show click hint with pulse animation
      tl.set(clickHintRef.current, { visibility: 'visible' })
      .to(clickHintRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      })
      .to(clickHintRef.current, {
        scale: 1.05,
        duration: 1.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    }, 100);
  };

  // Start animation on mount
  useEffect(() => {
    const timer = setTimeout(startAnimation, 300);
    return () => clearTimeout(timer);
  }, []);

  // Helper function to render words as blocks
  const renderWordsAsBlocks = (sentence: string[], charsRef: React.MutableRefObject<(HTMLSpanElement | null)[]>, sentenceRef: React.RefObject<HTMLDivElement>) => {
    const words = sentence.join('').split(' ');
    
    return (
      <div ref={sentenceRef} className="welcome-sentence" style={{ marginBottom: '20px' }}>
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="word-block" style={{ display: 'inline-block', marginRight: '0.2em' }}>
            {word.split('').map((char, charIndex) => {
              const globalIndex = words.slice(0, wordIndex).join(' ').length + charIndex;
              return (
                <span 
                  key={charIndex} 
                  ref={el => charsRef.current[globalIndex] = el}
                  className="letter"
                  style={{ display: 'inline-block', opacity: 0 }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </div>
    );
  };

  // Render individual sentences
  const renderSentence1 = () => renderWordsAsBlocks(sentence1, sentence1Chars, sentence1Ref);
  const renderSentence2 = () => renderWordsAsBlocks(sentence2, sentence2Chars, sentence2Ref);


  // Handle click to dismiss (both mobile and desktop)
  const handleClick = () => {
    if (!isDismissed && clickHintRef.current?.style.opacity === '1') {
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
                  {renderSentence1()}
                  {renderSentence2()}
                </div>
            </div>
          </div>
          
          {/* Mobile click hint */}
          {!isDismissed && (
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
              {renderSentence1()}
              {renderSentence2()}
            </div>
          </div>
          
          {/* Desktop click hint */}
          {!isDismissed && (
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
