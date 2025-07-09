import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Viewer from './components/Viewer.tsx';
import ToolPanel from './components/ToolPanel';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Viewer />} />
      </Routes>
      <ToolPanel />
    </Router>
  );
}

export default App;
