import React, { useState } from 'react';
import { SkyCanvas } from './components/canvas/SkyCanvas';
import Navigation from './components/Navigation';
import ContactModal from './components/ContactModal';
import './App.css';

function App() {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowContactModal(true);
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
  };

  return (
    <div className="App">
      <Navigation 
        onContactClick={handleContactClick} 
        isModalOpen={showContactModal}
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
