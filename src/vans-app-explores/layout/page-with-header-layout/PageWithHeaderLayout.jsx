import React from "react";
import { Outlet } from "react-router-dom";
import TopbarVan from "../../components/topbar/TopbarVan";

import "./PageWithHeaderLayout.scss";

export default function PageWithHeaderLayout() {
  return (
    <div className="page-with-header-layout-vans">
      <TopbarVan />
      <Outlet />
    </div>
  );
}
