import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import PageWithHeaderLayout from "../layout/page-with-header-layout/PageWithHeaderLayout.jsx";
import HostLayout from "../layout/host-layout/HostLayout.jsx";
import AuthRequired from "../layout/auth-required/AuthRequired.jsx";

import Vans, { loader as vansLoader } from "../pages/vans/Vans.jsx";
import VanDetail from "../pages/vans/van-detail/VanDetail.jsx";
import About from "../pages/about/About.jsx";
import Home from "../pages/home/Home.jsx";
import Dashboard from "../pages/host/dashboard/Dashboard.jsx";
import Income from "../pages/host/income/Income.jsx";
import Reviews from "../pages/host/reviews/Reviews.jsx";
import HostVans from "../pages/host/host-vans/HostVans.jsx";
import HostVanDetail from "../pages/host/host-van-detail/HostVanDetail.jsx";
import HostVanDetailDescriptions from "../pages/host/host-van-detail/host-van-detail-description/HostVanDetailDescriptions.jsx";
import HostVanDetailPricing from "../pages/host/host-van-detail/host-van-detail-pricing/HostVanDetailPricing.jsx";
import HostVanDetailPhotos from "../pages/host/host-van-detail/host-van-detail-photos/HostVanDetailPhotos.jsx";
import NotFound from "../pages/not-found/NotFound.jsx";
import LoginVan from "../pages/login/LoginVan.jsx";

import ErrorOccurElement from "../components/error/Error.jsx";

const routes = createRoutesFromElements(
  <Route path="/" element={<PageWithHeaderLayout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />

    <Route
      path="vans"
      element={<Vans />}
      loader={vansLoader}
      errorElement={<ErrorOccurElement />}
    />
    <Route path="vans/:id" element={<VanDetail />} />

    <Route element={<AuthRequired />}>
      <Route path="host" element={<HostLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="income" element={<Income />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="vans" element={<HostVans />} />

        <Route path="vans/:id" element={<HostVanDetail />}>
          <Route index element={<HostVanDetailDescriptions />} />
          <Route path="pricing" element={<HostVanDetailPricing />} />
          <Route path="photos" element={<HostVanDetailPhotos />} />
        </Route>
      </Route>
    </Route>

    <Route path="login" element={<LoginVan />} />
    <Route path="*" element={<NotFound />} />
  </Route>
);

export const explorationRouter = createBrowserRouter(routes);
