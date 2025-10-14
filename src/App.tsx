import { SkyCanvas } from './components/canvas/SkyCanvas';
import './App.css';

function App() {
  return (
    <div className="App">
      <main className="App-main">
        <SkyCanvas 
          enabledModules={['celestial', 'mountains', 'snow']}
          timeMultiplier={1.0}
          enablePerformanceMode={false}
        />
      </main>
    </div>
  );
}

export default App;
