import { RouterProvider } from "react-router-dom";
import { vansAppV2Router } from "./vans-app-explores-v2/router-vans-app-v2/index";
import "./AppVansExploreV2.scss";

export default function AppVansExploreV2() {
  return <RouterProvider router={vansAppV2Router} />;
}
