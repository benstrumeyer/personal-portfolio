import React, { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import './HobbiesModal.css';

interface HobbiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SportData {
  name: string;
  emoji: string;
  instagramVideo: string;
  color: string;
}

// Text content - same structure as welcome screen
const fullText = "I like being outside — surfing, snowboarding, climbing.\n\nGravity keeps me humble.\n\nSoup dumplings keep me going.";

const SPORTS: SportData[] = [
  {
    name: 'surfing',
    emoji: '🏄‍♂️',
    instagramVideo: '/surfing.mp4', 
    color: '#4A90E2'
  },
  {
    name: 'snowboarding',
    emoji: '🏂',
    instagramVideo: '/snowboarding.mp4', 
    color: '#7ED321'
  },
  {
    name: 'climbing',
    emoji: '🧗',
    instagramVideo: '/climbing.mp4', 
    color: '#F5A623'
  }
];

const HobbiesModal: React.FC<HobbiesModalProps> = ({ isOpen, onClose }) => {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [showClickHint, setShowClickHint] = useState(false);
  const [hoveredSport, setHoveredSport] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const { isMobile } = useMediaQuery();
  const modalRef = useRef<HTMLDivElement>(null);

  // Letter reveal animation (same as welcome screen)
  useEffect(() => {
    if (!isOpen) {
      setVisibleLetters(0);
      setShowClickHint(false);
      return;
    }

    // Calculate total letters
    const totalLetters = fullText.length;
    const revealSpeed = 50; // ms per letter
    
    const revealLetters = () => {
      setVisibleLetters(prev => {
        if (prev < totalLetters) {
          setTimeout(revealLetters, revealSpeed);
          return prev + 1;
        }
        // Show click hint after text is fully revealed
        setTimeout(() => setShowClickHint(true), 500);
        return prev;
      });
    };
    
    // Start animation after a short delay
    setTimeout(revealLetters, 300);
  }, [isOpen]);

  // Handle click to close
  const handleClick = () => {
    if (showClickHint && visibleLetters >= fullText.length) {
      onClose();
    }
  };

  // Render text (same structure as welcome screen)
  const renderText = () => {
    return fullText.split('').map((char, index) => (
      <span 
        key={index} 
        className={`letter ${index < visibleLetters ? 'visible' : ''}`}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  // Handle mouse move for tooltip positioning
  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  if (!isOpen) return null;

  return (
    <div className="hobbies-modal" ref={modalRef} onClick={handleClick}>
      <div className="hobbies-content">
        <div className="hobbies-text">
          {renderText()}
        </div>
        
        {/* Sport word hover areas */}
        <div className="sport-hover-areas">
          <div 
            className="sport-hover surfing"
            onMouseEnter={() => setHoveredSport('surfing')}
            onMouseLeave={() => setHoveredSport(null)}
            onMouseMove={handleMouseMove}
          />
          <div 
            className="sport-hover snowboarding"
            onMouseEnter={() => setHoveredSport('snowboarding')}
            onMouseLeave={() => setHoveredSport(null)}
            onMouseMove={handleMouseMove}
          />
          <div 
            className="sport-hover climbing"
            onMouseEnter={() => setHoveredSport('climbing')}
            onMouseLeave={() => setHoveredSport(null)}
            onMouseMove={handleMouseMove}
          />
        </div>
        
        {showClickHint && (
          <div className="click-hint">
            <p>Click anywhere to continue</p>
          </div>
        )}
        
         {/* Video Tooltip */}
         {hoveredSport && (
           <div 
             className="absolute z-50"
             style={{
               left: tooltipPosition.x + 10,
               top: tooltipPosition.y - 10,
             }}
           >
             <video
               src={SPORTS.find(s => s.name === hoveredSport)?.instagramVideo}
               autoPlay
               muted
               loop
               playsInline
               className="w-64 rounded-lg shadow-lg"
             />
           </div>
         )}
      </div>
    </div>
  );
};

export default HobbiesModal;
