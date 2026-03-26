import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Art from "./pages/Art";
import Events from "./pages/Events";
import Commissions from "./pages/Commissions";
import Shop from "./pages/Shop";
import Social from "./pages/Social";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="art" element={<Art />} />
          <Route path="events" element={<Events />} />
          <Route path="commissions" element={<Commissions />} />
          <Route path="shop" element={<Shop />} />
          <Route path="social" element={<Social />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
