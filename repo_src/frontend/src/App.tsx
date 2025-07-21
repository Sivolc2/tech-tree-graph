import CytoscapeGraph from './components/CytoscapeGraph';
import './styles/App.css';

function App() {
  return (
    <div className="graph-container">
      <header className="graph-header">
        <h1>Sci-Fi Tech Nexus</h1>
        <p>Hover over or tap a node to explore connections.</p>
      </header>
      <div className="graph-content">
        <CytoscapeGraph />
      </div>
    </div>
  )
}

export default App
