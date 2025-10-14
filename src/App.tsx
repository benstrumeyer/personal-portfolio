import { SkyCanvas } from './components/canvas/SkyCanvas';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Interactive Personal Portfolio</h1>
        <p>Sky Canvas Demo</p>
      </header>
      
      <main className="App-main">
        <SkyCanvas 
          width={window.innerWidth}
          height={window.innerHeight - 120} // Account for header
          enabledModules={['celestial']}
          timeMultiplier={1.0}
          enablePerformanceMode={false}
        />
      </main>
    </div>
  );
}

export default App;
