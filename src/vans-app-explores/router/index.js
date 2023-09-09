import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import PageWithHeaderLayout from "../layout/page-with-header-layout/PageWithHeaderLayout.jsx";
import HostLayout from "../layout/host-layout/HostLayout.jsx";

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

import { requiredAuth } from "../van-utils/requiredAuth.js";
import { pageGuard } from "../van-utils/pageGuard.js";

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

    <Route
      path="vans/:id"
      element={<VanDetail />}
      loader={async () => await requiredAuth()}
    />

    <Route path="host" element={<HostLayout />}>
      <Route
        index
        element={<Dashboard />}
        loader={async () => await requiredAuth()}
      />
      <Route
        path="income"
        element={<Income />}
        loader={async () => await requiredAuth()}
      />
      <Route
        path="reviews"
        element={<Reviews />}
        loader={async () => await requiredAuth()}
      />
      <Route
        path="vans"
        element={<HostVans />}
        loader={async () => await requiredAuth()}
      />

      <Route
        path="vans/:id"
        element={<HostVanDetail />}
        loader={async () => await requiredAuth()}
      >
        <Route
          index
          element={<HostVanDetailDescriptions />}
          loader={async () => await requiredAuth()}
        />
        <Route
          path="pricing"
          element={<HostVanDetailPricing />}
          loader={async () => await requiredAuth()}
        />
        <Route
          path="photos"
          element={<HostVanDetailPhotos />}
          loader={async () => await requiredAuth()}
        />
      </Route>
    </Route>

    <Route
      path="login"
      element={<LoginVan />}
      loader={async () => await pageGuard()}
    />
    <Route path="*" element={<NotFound />} />
  </Route>
);

export const explorationRouter = createBrowserRouter(routes);
