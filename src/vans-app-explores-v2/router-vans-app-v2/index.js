import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Vans, { vansLoader } from "../pages/vans/Vans";
import VanDetail, { vanDetailLoader } from "../pages/vans/VanDetail";
import PageWithHeaderAndFooter from "../layout/PageWithHeaderAndFooter";
import HostWithNav from "../layout/HostWithNav";
import Dashboard from "../pages/host/Dashboard";
import Income from "../pages/host/Income";
import Reviews from "../pages/host/Reviews";
import HostVans from "../pages/host/HostVans";
import HostVanDetailWithNav from "../layout/HostVanDetailWithNav";
import HostVanDetail from "../pages/host/HostVanDetail";
import HostVanDetailPricing from "../pages/host/HostVanDetailPricing";
import HostVanDetailPhotos from "../pages/host/HostVanDetailPhotos";
import NotFoundV2 from "../pages/NotFoundV2";

const routesElement = createRoutesFromElements(
  <Route path="/" element={<PageWithHeaderAndFooter />}>
    <Route index element={<Home />} />
    <Route path="About" element={<About />} />
    <Route
      path="vans"
      element={<Vans />}
      loader={vansLoader}
      errorElement={<NotFoundV2 />}
    />
    <Route
      path="vans/:vanId"
      element={<VanDetail />}
      loader={vanDetailLoader}
      errorElement={<NotFoundV2 />}
    />

    <Route path="host" element={<HostWithNav />}>
      <Route index element={<Dashboard />} />
      <Route path="income" element={<Income />} />
      <Route path="reviews" element={<Reviews />} />
      <Route path="vans" element={<HostVans />} />

      <Route path="vans/:hostVanId" element={<HostVanDetailWithNav />}>
        <Route index element={<HostVanDetail />} />
        <Route path="pricing" element={<HostVanDetailPricing />} />
        <Route path="photos" element={<HostVanDetailPhotos />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFoundV2 />} />
  </Route>,
);

export const vansAppV2Router = createBrowserRouter(routesElement);
