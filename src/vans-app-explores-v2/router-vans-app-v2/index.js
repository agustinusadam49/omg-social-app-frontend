import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Vans, { vansLoader } from "../pages/vans/Vans";
import VanDetailV2, { vanDetailLoaderV2 } from "../pages/vans/VanDetailV2";
import PageWithHeaderAndFooter from "../layout/PageWithHeaderAndFooter";
import HostWithNav from "../layout/HostWithNav";
import Dashboard, { hostVansDashboarLoader } from "../pages/host/Dashboard";
import Income from "../pages/host/Income";
import Reviews, { hostVanReviewsLoader } from "../pages/host/Reviews";
import HostVans, { hostVansLoaderV2 } from "../pages/host/HostVans";
import HostVanDetailWithNav, {
  hostVanDetailV2Loader,
} from "../layout/HostVanDetailWithNav";
import HostVanDetail from "../pages/host/HostVanDetail";
import HostVanDetailPricing from "../pages/host/HostVanDetailPricing";
import HostVanDetailPhotos from "../pages/host/HostVanDetailPhotos";
import NotFoundV2 from "../pages/NotFoundV2";
import LoginVanV2, { loginVanLoaderV2 } from "../pages/LoginVanV2";
import { nonFetchingDataLoader } from "../utils/index";

const routesElement = createRoutesFromElements(
  <Route path="/" element={<PageWithHeaderAndFooter />}>
    <Route index element={<Home />} />
    <Route
      path="login-van-v2"
      element={<LoginVanV2 />}
      loader={loginVanLoaderV2}
    />
    <Route path="about-v2" element={<About />} />
    <Route
      path="vans-v2"
      element={<Vans />}
      loader={vansLoader}
      errorElement={<NotFoundV2 />}
    />
    <Route
      path="vans-v2/:vanId"
      element={<VanDetailV2 />}
      loader={vanDetailLoaderV2}
      errorElement={<NotFoundV2 />}
    />

    <Route path="host-v2" element={<HostWithNav />}>
      <Route
        index
        element={<Dashboard />}
        loader={hostVansDashboarLoader}
        errorElement={<NotFoundV2 />}
      />
      <Route
        path="income"
        element={<Income />}
        loader={nonFetchingDataLoader}
      />
      <Route
        path="reviews"
        element={<Reviews />}
        loader={hostVanReviewsLoader}
        errorElement={<NotFoundV2 />}
      />
      <Route
        path="vans"
        element={<HostVans />}
        loader={hostVansLoaderV2}
        errorElement={<NotFoundV2 />}
      />

      <Route
        path="vans/:hostVanId"
        element={<HostVanDetailWithNav />}
        loader={hostVanDetailV2Loader}
        errorElement={<NotFoundV2 />}
      >
        <Route
          index
          element={<HostVanDetail />}
          loader={nonFetchingDataLoader}
        />
        <Route
          path="pricing"
          element={<HostVanDetailPricing />}
          loader={nonFetchingDataLoader}
        />
        <Route
          path="photos"
          element={<HostVanDetailPhotos />}
          loader={nonFetchingDataLoader}
        />
      </Route>
    </Route>

    <Route path="*" element={<NotFoundV2 />} />
  </Route>,
);

export const vansAppV2Router = createBrowserRouter(routesElement);
