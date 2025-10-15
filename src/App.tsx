import React, { useState } from 'react';
import { SkyCanvas } from './components/canvas/SkyCanvas';
import Navigation from './components/Navigation';
import ContactModal from './components/ContactModal';
import WelcomeScreen from './components/WelcomeScreen';
import HobbiesModal from './components/HobbiesModal';
import './App.css';

function App() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [showHobbiesModal, setShowHobbiesModal] = useState(false);

  const handleContactClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowContactModal(true);
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
  };

  const handleWelcomeDismiss = () => {
    setShowWelcomeScreen(false);
  };

  const handleHobbiesClick = () => {
    setShowHobbiesModal(true);
  };

  const handleHobbiesClose = () => {
    setShowHobbiesModal(false);
  };

  return (
    <div className="App">
      {showWelcomeScreen && (
        <WelcomeScreen onDismiss={handleWelcomeDismiss} />
      )}
      
      <Navigation 
        onContactClick={handleContactClick}
        onHobbiesClick={handleHobbiesClick}
        isModalOpen={showContactModal}
        className={showWelcomeScreen ? 'hidden' : 'visible'}
      />
      
      <main className="App-main">
        <SkyCanvas 
          enabledModules={['celestial', 'mountains', 'snow', 'lightning', 'rain']}
          timeMultiplier={1.0}
          enablePerformanceMode={false}
        />
      </main>
      
      <ContactModal 
        isOpen={showContactModal}
        onClose={handleCloseModal}
      />
      
      <HobbiesModal 
        isOpen={showHobbiesModal}
        onClose={handleHobbiesClose}
      />
    </div>
  );
}

export default App;
