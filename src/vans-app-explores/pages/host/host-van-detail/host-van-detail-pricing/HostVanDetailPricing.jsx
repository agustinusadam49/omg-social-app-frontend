import React from "react";
import { useOutletContext } from "react-router-dom";

import "./HostVanDetailPricing.scss";

export default function HostVanDetailPricing() {
  const { hostVanDetail } = useOutletContext();

  const formatPriceToRupiah = (priceInput) => {
    const stringPriceInputAndReverse = String(priceInput)
      .split("")
      .reverse()
      .join("");

    let formattedPrice = "";

    for (let i = 0; i < stringPriceInputAndReverse.length; i++) {
      if (i % 3 === 0) {
        formattedPrice += `.${stringPriceInputAndReverse[i]}`;
      } else {
        formattedPrice += stringPriceInputAndReverse[i];
      }
    }

    return formattedPrice
      .split("")
      .reverse()
      .join("")
      .substring(0, formattedPrice.length - 1);
  };

  return (
    <div className="host-van-detail-pricing">
      <p>
        <strong>Rp. {formatPriceToRupiah(hostVanDetail.price)}</strong>/hari
      </p>
    </div>
  );
}
