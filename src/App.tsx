import { SkyCanvas } from './components/canvas/SkyCanvas';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navigation />
      <main className="App-main">
        <SkyCanvas 
          enabledModules={['celestial', 'mountains', 'snow', 'lightning', 'rain']}
          timeMultiplier={1.0}
          enablePerformanceMode={false}
        />
      </main>
    </div>
  );
}

export default App;
