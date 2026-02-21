import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Art from './pages/Art';
import Works from './pages/Works';
import Shows from './pages/Shows';
import Commissions from './pages/Commissions';
import Shop from './pages/Shop';
import Social from './pages/Social';

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/art" element={<Art />}>
          <Route path="works" element={<Works />} />
          <Route path="shows" element={<Shows />} />
          <Route path="commissions" element={<Commissions />} />
        </Route>
        <Route path="/shop" element={<Shop />} />
        <Route path="/social" element={<Social />} />
      </Routes>
    </AnimatePresence>
  );
}
