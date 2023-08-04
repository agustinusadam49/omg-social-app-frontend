import React from "react";
import { Outlet } from "react-router-dom";
import TopbarVan from "../../components/topbar/TopbarVan";
import FooterVan from "../../components/footer/FooterVan";

import "./PageWithHeaderLayout.scss";

export default function PageWithHeaderLayout() {
  return (
    <div className="page-with-header-layout-vans">
      <TopbarVan />
      <main>
        <Outlet />
      </main>
      <FooterVan />
    </div>
  );
}
