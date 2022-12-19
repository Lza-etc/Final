import React from "react";
import "leaflet/dist/leaflet.css";
import CetMap from "../components/CetMap";

function Home() {
  return (
    <div>
      <div className="map">
        <CetMap navi={false} />
      </div>
    </div>
  );
}

export default Home;
