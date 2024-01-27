import React from "react";
import { useRouteError, Link } from "react-router-dom";

import "./ErrorPage.scss";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-page">
      <h2 className="wording-1">Maaf, halaman ini tidak tersedia</h2>
      <div className="wording-and-link-wrapper">
        <div className="wording-2">
          Tautan yang Anda ikuti mungkin rusak, atau halaman mungkin sudah
          dihapus.
        </div>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            marginTop: "20px",
          }}
          className="return-to-home"
        >
          Kembali ke Omongin
        </Link>
      </div>
      {/* <p>
        <i>{error.statusText || error.message}</i>
      </p> */}
    </div>
  );
}
