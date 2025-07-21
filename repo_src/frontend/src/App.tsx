import CytoscapeGraph from './components/CytoscapeGraph';
import './styles/App.css'

function App() {
  return (
    <div className="graph-container">
      <header className="graph-header">
        <h1>Sci-Fi Tech & Literature Graph (Cytoscape)</h1>
        <p>Hover over a technology to see related books.</p>
      </header>
      <CytoscapeGraph />
    </div>
  )
}

export default App
