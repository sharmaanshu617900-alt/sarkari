"use client";
import { useEffect } from "react";

export default function AdBanner({ dataAdSlot, dataAdFormat = "auto", dataFullWidthResponsive = true }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className="container" style={{ margin: "20px auto", textAlign: "center", overflow: "hidden", minHeight: "90px" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7367387602825591"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </div>
  );
}
