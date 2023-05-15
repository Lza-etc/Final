import React from "react";
import "leaflet/dist/leaflet.css";
import CetMap from "../components/CetMap";

import {Nav,Button,Form} from "react-bootstrap";

function Home({nav,navi,startLa,startLo,endLa,endLo}) {
  return (
    <div >
      <div className="map"> 
      <CetMap nav={nav} navi={navi} endLa={endLa} endLo={endLo} startLa={startLa} startLo={startLo}/>
        </div>
     
      
      
    </div>
  );
}

export default Home;
