import React, { useState } from 'react';
import { SkyCanvas } from './components/canvas/SkyCanvas';
import Navigation from './components/Navigation';
import ContactModal from './components/ContactModal';
import WelcomeScreen from './components/WelcomeScreen';
import './App.css';

function App() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

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

  return (
    <div className="App">
      {showWelcomeScreen && (
        <WelcomeScreen onDismiss={handleWelcomeDismiss} />
      )}
      
      <Navigation 
        onContactClick={handleContactClick} 
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
    </div>
  );
}

export default App;
