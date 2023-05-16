import React, { Component } from "react";
import L from "leaflet";
import { useLocation } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup,Polygon } from "react-leaflet";
import { Nav, Button, Form } from "react-bootstrap";
import location from "../assets/location.png";
// import data from "../assets/cet_main.json";
import Routing from "./RoutingMachine";
import "../styles/CetMap.css";
import axios from 'axios';
// import { useFloorData } from '../hooks/useFloorData';
// import getFloors from "../api/getFloors"



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
      loc:1,
      navi: this.props.navi,
      startLa: this.props.startLa,
      startLo: this.props.startLo,
      endLa: this.props.endLa,
      endLo: this.props.endLo,
      popup: "",
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.navi !== this.props.navi) 
      // Props have changed, update the state
      if (this.props.navi !== this.state.navi) 
      this.setState({navi: this.props.navi ,
        startLa: this.props.startLa,
        startLo: this.props.startLo,
        endLa: this.props.endLa,
        endLo: this.props.endLo       
      
      });
    
    
    if  ((this.props.loc && this.props.loc !== this.state.loc)||(this.props.loc !==this.state.val)) {
      console.log("hii")
      this.setState({
        val: this.props.loc,
      });
      console.log(this.state.val,this.props.loc);
      const event = new Event('click', { bubbles: true, cancelable: true });
      if(this.props.loc ===this.state.val && this.state.loc){
        this.setState({
          loc:0
        });
        this.handleSearch(event);
      }
      
    }
    
    // console.log(this.state);
  }
  async componentDidMount() {

  }
  
  
  saveMap = (map) => {
    // console.log(map);
    this.map = map;
    this.setState({
      map: map
    });
  };
  
  handleSearch = async(event) => {
    event.preventDefault(); // Prevent default submission
    console.log("search "+this.state.val);
    if (this.state.marker) {
      this.setState({
        marker: null
      });
    } else {
      var f = 0,x,y;
      await axios.get("http://127.0.0.1:5000/floors/cse1").then(res=>{
        res.data.rooms.map((building) => {
          const regex = /[^a-z0-9]+/gi;
          const b= building["ID"].replace(regex, "");
          if (
            this.state.val.toLowerCase() ===
            b.toLowerCase()
          ) {
            console.log("got it")
            x = building["y"];
            y = building["x"];
            this.setState({
              popup: building["ID"]
            });
            f = 1;
          }
          return 0;
        });
      })
      await axios.get("http://127.0.0.1:5000/depts").then(res=>{
        // console.log(res.data)
        res.data.depts.map((building) => {
          const regex = /[^a-z0-9]+/gi;
          const b= building["id"].replace(regex, "");
          if (
            this.state.val.toLowerCase() ===
            b.toLowerCase()
          ) {
            console.log("got it")
            x = building["y"];
            y = building["x"];
            this.setState({
              popup: building["name"]
            });
            f = 1;
          }
          return 0;
        });
      })
      
      if (f === 1) {
        console.log("hello")
        console.log(x, y, this.state.val);
        this.setState({
          srch: true,
          endLa: x,
          endLo: y
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
  handleClick = (event) => {
    console.log('Clicked polygon:', event.target);
    // Do something when polygon is clicked
  };
  onChange = (event) => {
    this.setState({
      val: event
    });
  };
  render() {
    const position = [this.state.lat, this.state.lng];
    // const { loc, srch } = useLocation().state || {};
    // console.log(this.props.location.state); // 'value1'
    // console.log(loc);
    const polygon = [[8.54596, 76.90359 ], [8.54601, 76.90407],  [8.54552, 76.90412],[8.54547, 76.90364]];
    const polygonStyle = {
      fillColor: '#00FF00',
      weight: 1,
      opacity: 1,
      color: '#00FF00',
      fillOpacity: 0.1,
    };
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
                  <Polygon
                    positions={polygon}
                    pathOptions={polygonStyle}
                    eventHandlers={{
                      click: this.handleClick,
                    }}
                  >
                    <Popup>{this.state.popup}</Popup>
                  </Polygon>
                </Marker>
              </div>
            )}
            
            
            {this.state.navi && (
              <Routing
                map={this.map}
                startLoc={[this.state.startLa, this.state.startLo]}
                endLoc={[this.state.endLa, this.state.endLo]}
              />
            )}

          </Map>
        </div>
      </div>
    );
  }
}
