import React, { Component } from "react";
import L from "leaflet";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { Nav, Button, Form } from "react-bootstrap";
import location from "../assets/location.png";
import data from "../assets/cet_main.json";
import Routing from "./RoutingMachine";
import "../styles/CetMap.css";
import axios from 'axios';
// import { useFloorData } from '../hooks/useFloorData';
// import getFloors from "../api/getFloors"


// 8129767412

export default class CetMap extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      lat: 8.54592,
      lng: 76.90623,
      zoom: 17.5,
      val: null,
      marker: null,
      map: null,
      srch: false,
      endLa: this.props.startLa,
      endLo: this.props.startLng,
      popup: "",
      data:[]
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get("http://127.0.0.1:5000/floors/cse1");
      // console.log(response.data); 
      this.setState({ data: response.data });
    } catch (error) {
      console.error(error);
    }
  }
  
  
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
      var f = 0,x,y;
      var d=this.state.data;
      d.rooms.map((building) => {
        if (
          this.state.val.toLowerCase() ===
          building["ID"].toLowerCase()
        ) {
          // console.log(building['Building name'],building['x'],building['y'])
          x = building["y"];
          y = building["x"];
          f = 1;
        }
        return 0;
      });
      if (f === 1) {
        // console.log("hello")
        console.log(x, y, this.state.val);
        this.setState({
          srch: true,
          endLa: x,
          endLo: y,
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
      lat: this.state.endLa,
      lng: this.state.endLo,
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
    // console.log(useFloorData());
    var myIcon = L.icon({
      iconUrl: location,
      iconSize: [50, 50]
    });
    const data=this.state.data;
   
    if (!data) {
      return <div>Loading...</div>;
    }

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
              <div>
                <Marker
                  position={[this.state.endLa, this.state.endLo]}
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
              </div>
            )}
            
            {this.state.navi && <Routing map={this.map} />}
          </Map>
        </div>
      </div>
    );
  }
}