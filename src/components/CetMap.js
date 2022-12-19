import React, { Component } from "react";
import L from "leaflet";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { Nav, Button, Form } from "react-bootstrap";
import location from "../assets/location.png";
import data from "../assets/cet_main.json";
import Routing from "./RoutingMachine";
import "../styles/CetMap.css";
// export class RecenterAutomatically extends Component{
//   const  = ({lat,lng}) => {
//     const map = useMap();
//      useEffect(() => {
//        map.setView([lat, lng]);
//      }, [lat, lng]);
//      return null;
//    }
// }
export default class CetMap extends Component {
  state = {
    lat: 8.54592,
    lng: 76.90623,
    zoom: 17.5,
    val: null,
    marker: null,
    map: null,
    srch: false,
    startLa: this.props.startLa,
    startLo: this.props.startLng,
    popup: ""
  };

  saveMap = (map) => {
    // console.log(map);
    this.map = map;
    this.setState({
      map: map
    });
  };

  handleSearch = (event) => {
    event.preventDefault(); // Prevent default submission
    if (this.state.marker) {
      this.setState({
        marker: null
      });
    } else {
      var f = 0,
        x,
        y;
      data.map((building) => {
        if (
          this.state.val.toLowerCase() ===
          building["Building name"].toLowerCase()
        ) {
          // console.log(building['Building name'],building['x'],building['y'])
          x = building["x"];
          y = building["y"];
          f = 1;
        }
        return 0;
      });
      if (f === 1) {
        // console.log("hello")
        console.log(x, y, this.state.val);
        this.setState({
          srch: true,
          startLa: x,
          startLo: y,
          popup: this.state.val
        });
        // this.map.setView(new L.LatLng(x, y), 19);
      } else {
        alert("no such building");
      }
    }
  };
  recenter = () => {
    this.setState({
      lat: this.state.startLa,
      lng: this.state.startLo,
      zoom: 18.5
    });
  };
  onChange = (event) => {
    this.setState({
      val: event
    });
  };

  render() {
    const position = [this.state.lat, this.state.lng];
    var myIcon = L.icon({
      iconUrl: location,
      iconSize: [50, 50]
    });
    return (
      <div className=" map-container">
        <div className="search-btn ">
          <Nav className="me-auto">
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={(e) => {
                  this.onChange(e.target.value);
                }}
              />
              <Button
                className="search-side-btn"
                variant="outline-success"
                onClick={this.handleSearch}
              >
                Search
              </Button>
            </Form>
          </Nav>
        </div>

        <div id="map">
          <Map center={position} zoom={this.state.zoom} ref={this.saveMap}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {this.state.srch && (
              <>
                <Marker
                  position={[this.state.startLa, this.state.startLo]}
                  icon={myIcon}
                  onAdd={(e) => {
                    e.target.openPopup();
                    this.recenter();
                  }}
                  // onMouseOut={(e) => {
                  //   e.target.closePopup();
                  // }}
                  // onChange={this.recenter}
                >
                  <Popup> {this.state.popup}</Popup>
                </Marker>
              </>
            )}
            {this.state.navi && <Routing map={this.map} />}
          </Map>
        </div>
      </div>
    );
  }
}
