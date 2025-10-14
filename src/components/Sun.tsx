import React from 'react';

/**
 * Simple Sun Component
 * 
 * A clean React component with rotating rays using inline styles.
 */

interface SunProps {
  size?: number;
  x?: number;
  y?: number;
  isVisible?: boolean;
}

export const Sun: React.FC<SunProps> = ({ 
  size = 70, 
  x = 0, 
  y = 0, 
  isVisible = true 
}) => {
  if (!isVisible) return null;

  const sunStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${x - size / 2}px`,
    top: `${y - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    background: 'white',
    opacity: 0.6,
    boxShadow: '0px 0px 20px 8px rgba(255, 255, 255, 0.3)',
    zIndex: 10,
  };

  const rayContainerStyle: React.CSSProperties = {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    animation: 'rotate 120s linear infinite',
    top: 0,
    left: 0,
  };

  const createRay = (index: number, length: number, width: number, angle: number) => {
    const rayStyle: React.CSSProperties = {
      position: 'absolute',
      width: `${width}px`,
      height: `${length}px`,
      background: 'linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)',
      borderRadius: '80% 80% 0 0',
      opacity: 0.05,
      transform: `rotate(${angle}deg)`,
      transformOrigin: 'center bottom',
      left: '50%',
      bottom: '50%',
      marginLeft: `-${width / 2}px`,
    };

    return <div key={index} style={rayStyle} />;
  };

  const rays = [
    { length: 60, width: 8, angle: 0 },
    { length: 80, width: 4, angle: 36 },
    { length: 70, width: 6, angle: 72 },
    { length: 90, width: 5, angle: 108 },
    { length: 65, width: 7, angle: 144 },
    { length: 85, width: 3, angle: 180 },
    { length: 75, width: 9, angle: 216 },
    { length: 95, width: 4, angle: 252 },
    { length: 80, width: 6, angle: 288 },
    { length: 70, width: 5, angle: 324 },
  ];

  return (
    <div style={sunStyle}>
      <div style={rayContainerStyle}>
        {rays.map((ray, index) => createRay(index, ray.length, ray.width, ray.angle))}
      </div>
    </div>
  );
};

export default Sun;
