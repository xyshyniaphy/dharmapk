import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Viewer from './components/Viewer.tsx';
import './index.css';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<Viewer />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
