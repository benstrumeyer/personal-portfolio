import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

interface P5TypewriterProps {
  text: string;
  onComplete: () => void;
  onCharacterComplete?: (charIndex: number) => void;
  className?: string;
  targetPosition?: { x: number; y: number };
  shouldTranslate?: boolean;
}

const P5Typewriter: React.FC<P5TypewriterProps> = ({
  text,
  onComplete,
  onCharacterComplete,
  className = '',
  targetPosition,
  shouldTranslate = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let fontSize = 48;
      let typingSpeed = 60; // ms per character
      let lastTypingTime = 0;
      let startX = 0;
      let startY = 0;
      let currentX = 0;
      let currentY = 0;
      let targetX = 0;
      let targetY = 0;
      let isTypingComplete = false;

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(containerRef.current!);
        p.background(0, 0, 0, 0); // Transparent background
        
        // Set initial position (center of screen)
        startX = p.width / 2;
        startY = p.height / 2;
        currentX = startX;
        currentY = startY;
        
        // Set target position if provided
        if (targetPosition) {
          targetX = targetPosition.x;
          targetY = targetPosition.y;
        } else {
          targetX = startX;
          targetY = startY;
        }
      };

      p.draw = () => {
        // Only clear if we need to update
        let needsUpdate = false;
        
        // Typing animation
        if (currentIndex < text.length && !isTypingComplete) {
          const currentTime = p.millis();
          if (currentTime - lastTypingTime > typingSpeed) {
            setCurrentIndex(prev => prev + 1);
            onCharacterComplete?.(currentIndex);
            lastTypingTime = currentTime;
            needsUpdate = true;
          }
        } else if (currentIndex >= text.length && !isTypingComplete) {
          isTypingComplete = true;
          onComplete();
          needsUpdate = true;
        }

        // Translation animation
        if (shouldTranslate && isTypingComplete && !isTranslating) {
          setIsTranslating(true);
          needsUpdate = true;
        }

        // Update position during translation
        if (isTranslating) {
          const easeFactor = 0.05; // Smooth interpolation
          const newX = p.lerp(currentX, targetX, easeFactor);
          const newY = p.lerp(currentY, targetY, easeFactor);
          
          // Only update if position changed significantly
          if (p.abs(newX - currentX) > 0.1 || p.abs(newY - currentY) > 0.1) {
            currentX = newX;
            currentY = newY;
            needsUpdate = true;
          }
          
          // Check if we've reached the target
          if (p.abs(currentX - targetX) < 1 && p.abs(currentY - targetY) < 1) {
            currentX = targetX;
            currentY = targetY;
          }
        }

        // Only redraw if something changed
        if (needsUpdate || currentIndex < text.length) {
          p.background(0, 0, 0, 0); // Clear with transparent background
          
          // Draw text
          p.push();
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(fontSize);
          p.fill(255, 255, 255, 255);
          p.text(text.substring(0, currentIndex), currentX, currentY);
          
          // Draw cursor
          if (currentIndex < text.length || isTranslating) {
            const cursorX = currentX + p.textWidth(text.substring(0, currentIndex)) / 2 + 5;
            const cursorOpacity = p.sin(p.frameCount * 0.2) * 127 + 128;
            p.fill(255, 255, 255, cursorOpacity);
            p.text("|", cursorX, currentY);
          }
          p.pop();
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        
        // Update positions on resize
        startX = p.width / 2;
        startY = p.height / 2;
        if (!isTranslating) {
          currentX = startX;
          currentY = startY;
        }
      };
    };

    p5Ref.current = new p5(sketch);

    return () => {
      if (p5Ref.current) {
        p5Ref.current.remove();
      }
    };
  }, [text, onComplete, onCharacterComplete, targetPosition, shouldTranslate]);


  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000
      }}
    />
  );
};

export default P5Typewriter;
