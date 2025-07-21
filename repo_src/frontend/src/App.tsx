import CytoscapeGraph from './components/CytoscapeGraph';
import './styles/App.css'

function App() {
  return (
    <div className="graph-container">
      <header className="graph-header">
        <h1>Sci-Fi Tech Graph (Force-Directed Layout)</h1>
        <p>Hover over a technology to see related books.</p>
      </header>
      <div className="graph-content">
        <CytoscapeGraph />
      </div>
    </div>
  )
}

export default App
