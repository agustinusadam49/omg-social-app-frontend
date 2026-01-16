import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./vans-app-explores-v2/pages/Home";
import About from "./vans-app-explores-v2/pages/About";
import Vans from "./vans-app-explores-v2/pages/Vans";
import VanDetail from "./vans-app-explores-v2/pages/VanDetail";

import "./AppVansExploreV2.scss";

export default function AppVansExploreV2() {
  return (
    <BrowserRouter>
      <header>
        <Link className="site-logo" to="/">
          #VANLIFE
        </Link>
        <nav>
          <Link to="/vans">Vans</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/vans" element={<Vans />} />
        <Route path="/vans/:vanId" element={<VanDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
