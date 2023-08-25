import React from "react";
import { useMatches } from "react-router-dom";

import PageWithHeaderLayout from "../page-with-header-layout/PageWithHeaderLayout";
import NoHeaderLayout from "../no-header-layout/NoHeaderLayout";

export default function LayoutSwitcher() {
  const matches = useMatches();
  const layoutType = matches[matches.length - 1]?.handle?.layout || "default";

  const layoutTypeMapped = {
    default: <PageWithHeaderLayout />,
    noHeader: <NoHeaderLayout />,
  };

  const getLayoutToSwitch = (layout) => {
    return layoutTypeMapped[layout];
  };

  return getLayoutToSwitch(layoutType);
}
