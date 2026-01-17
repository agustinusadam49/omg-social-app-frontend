import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./vans-app-explores-v2/pages/Home";
import About from "./vans-app-explores-v2/pages/About";
import Vans from "./vans-app-explores-v2/pages/vans/Vans";
import VanDetail from "./vans-app-explores-v2/pages/vans/VanDetail";
import PageWithHeaderAndFooter from "./vans-app-explores-v2/layout/PageWithHeaderAndFooter";
import HostWithNav from "./vans-app-explores-v2/layout/HostWithNav";
import Dashboard from "./vans-app-explores-v2/pages/host/Dashboard";
import Income from "./vans-app-explores-v2/pages/host/Income";
import Reviews from "./vans-app-explores-v2/pages/host/Reviews";
import HostVans from "./vans-app-explores-v2/pages/host/HostVans";
import HostVanDetail from "./vans-app-explores-v2/pages/host/HostVanDetail";

import "./AppVansExploreV2.scss";

export default function AppVansExploreV2() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageWithHeaderAndFooter />}>
          <Route index element={<Home />} />
          <Route path="About" element={<About />} />
          <Route path="vans" element={<Vans />} />
          <Route path="vans/:vanId" element={<VanDetail />} />

          <Route path="host" element={<HostWithNav />}>
            <Route index element={<Dashboard />} />
            <Route path="income" element={<Income />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="vans" element={<HostVans />} />
            <Route path="vans/:hostVanId" element={<HostVanDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
