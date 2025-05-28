import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/Home';

function App() {
  return (
    <Routes>
      <Route path="/" index element={<HomePage />} />
    </Routes>
  );
}

export default App;
