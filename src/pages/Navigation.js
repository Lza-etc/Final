import React, { Component } from "react";
import L from "leaflet";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { Nav, Button, Form } from "react-bootstrap";
import location from "../assets/location.png";
import data from "../assets/cet_main.json";
import Routing from "../components/RoutingMachine";
import "../styles/CetMap.css";

export default class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 8.54592,
      lng: 76.90623,
      zoom: 17.5,
      startval: null,
      endval: null,
      map: null,
      navi: this.props.navi,
      startLa: this.props.startLa,
      startLo: this.props.startLng,
      endLa: this.props.endLa,
      endLng: this.props.endLng
    };
  }
  saveMap = (map) => {
    // console.log(map);
    this.map = map;
    this.setState({
      map: map
    });
  };

  handleNavi = (event) => {
    event.preventDefault(); // Prevent default submission

    var sf = 0;
    var sx;
    var sy;
    var ef = 0;
    var ex;
    var ey;
    data.map((building) => {
      if (
        this.state.startval.toLowerCase() ===
        building["Building name"].toLowerCase()
      ) {
        // console.log(building['Building name'],building['x'],building['y'])
        sx = building["x"];
        sy = building["y"];
        sf = 1;
      }
      if (
        this.state.endval.toLowerCase() ===
        building["Building name"].toLowerCase()
      ) {
        // console.log(building['Building name'],building['x'],building['y'])
        ex = building["x"];
        ey = building["y"];
        ef = 1;
      }
      return 0;
    });
    if (ef === 1 && sf === 1) {
      // console.log("hello")
      console.log(sx, sy, this.state.startval);
      console.log(ex, ey, this.state.endval);
      this.setState({
        navi: true,
        startLa: sx,
        startLo: sy,
        endLa: ex,
        endLng: ey
      });
    } else if (sf === 0) {
      alert("no such start location");
    } else if (ef === 0) {
      alert("no such end location");
    }
  };

  onChangeStart = (event) => {
    this.setState({
      startval: event
    });
  };
  onChangeEnd = (event) => {
    this.setState({
      endval: event
    });
  };

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <div className=" map-container">
        <div className="dept-nav " hidden={this.state.navi}>
          <input
            className="dept-nav-loc"
            type="text"
            placeholder="Start Location"
            onChange={(e) => {
              this.onChangeStart(e.target.value);
            }}
          />
          <input
            className="dept-nav-loc"
            type="text"
            placeholder="Destination"
            onChange={(e) => {
              this.onChangeEnd(e.target.value);
            }}
          />
          <div className="dept-nav-btn">
            <button>Cancel</button>
            <button onClick={this.handleNavi}>Find Route</button>
          </div>
        </div>

        <div id="map">
          <Map center={position} zoom={this.state.zoom} ref={this.saveMap}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {this.state.navi && (
              <Routing
                map={this.map}
                startLoc={[this.state.startLa, this.state.startLo]}
                endLoc={[this.state.endLa, this.state.endLng]}
              />
            )}
          </Map>
        </div>
      </div>
    );
  }
}
