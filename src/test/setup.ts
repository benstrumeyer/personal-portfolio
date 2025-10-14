import '@testing-library/jest-dom';

// Mock P5.js for testing
jest.mock('p5', () => {
  return jest.fn().mockImplementation(() => ({
    createCanvas: jest.fn(),
    background: jest.fn(),
    fill: jest.fn(),
    noStroke: jest.fn(),
    circle: jest.fn(),
    width: 800,
    height: 600,
    millis: jest.fn(() => Date.now()),
    resizeCanvas: jest.fn(),
    remove: jest.fn(),
  }));
});

// Mock window.innerWidth and window.innerHeight
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});
