import { ReactFlowProvider } from 'reactflow';
import TechBookGraph from './components/TechBookGraph';
import './styles/App.css'

function App() {
  return (
    <div className="graph-container">
      <header className="graph-header">
        <h1>Sci-Fi Technology & Literature Graph</h1>
        <p>Hover over a technology to see related books.</p>
      </header>
      <ReactFlowProvider>
        <TechBookGraph />
      </ReactFlowProvider>
    </div>
  )
}

export default App
