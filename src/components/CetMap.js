import React, { Component } from "react";
import L from "leaflet";
import { useLocation } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup,Polygon ,Tooltip,GeoJSON} from "react-leaflet";
import { Nav, Button, Form } from "react-bootstrap";
import location from "../assets/location.png";
// import data from "../assets/cet_main.json";
import Routing from "./RoutingMachine";
import "../styles/CetMap.css";
import axios from 'axios';
// import { useFloorData } from '../hooks/useFloorData';
// import getFloors from "../api/getFloors"



export default class CetMap extends Component {
  prevSessionStorageValue = sessionStorage.getItem('loc');
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
      navi: this.props.navi,
      startLa: this.props.startLa,
      startLo: this.props.startLo,
      endLa: this.props.endLa,
      endLo: this.props.endLo,
      buildingGeoJSON:null,
      data:null,
      popup: "",
    };

  }
  componentDidMount() {
    // const sessionStorageValue = sessionStorage.getItem('srch');
    // if (sessionStorageValue === true) {
    //   this.setState({ val: 'loc' ,srch:false});
    //   console.log("hello")
    //   console.log(sessionStorage.getItem('loc'))
    // }
    // componentDidMount() {

    const sessionStorageValue = sessionStorage.getItem("srch");
    const val = sessionStorage.getItem("loc");

    if (sessionStorageValue && val) {
      sessionStorage.setItem("dest",val)
      this.setState({
        val:val
      })
      var f=this.searchLoc(val)
      if(f && f===0){
        console.log("no such building");
      }
      sessionStorage.removeItem('srch')
        // this.map.setView(new L.LatLng(x, y), 19);
      }
      else{
          sessionStorage.removeItem("loc")
          
          
      }
      const apiUrls = [
        'http://127.0.0.1:5000/floors/cse1',
        'http://127.0.0.1:5000/floors/cse2',
        'http://127.0.0.1:5000/floors/cse0'
      ];
  
      const apiRequests = apiUrls.map(url => fetch(url).then(response => response.json()));
  
      Promise.all(apiRequests)
        .then(responses => {
          var combinedResponse = [];
          responses.forEach((response, index) => {
            combinedResponse = [...combinedResponse,...response.rooms];
          });
  
          // Do something with the combined response object
          // console.log('Combined Response:', combinedResponse);
          this.setState({
            data:combinedResponse
          })
        })
        .catch(error => {
          console.error('Error:', error);
        });

      //   setTimeout(() => {
      //   const fetchBuildingCoordinates = async () => {
      //     try {
      //       const response = await fetch(
      //         `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent("CE1")}&format=json`
      //       );
      //       const data = await response.json();
    
      //       if (data && data.length > 0) {
      //         const { lat, lon } = data[0];
      //         var GeoJSON={
      //           type: 'Point',
      //           coordinates: [parseFloat(lat), parseFloat(lon)],
      //         }
      //         this.setState({
      //           buildingGeoJSON:GeoJSON
      //         });
      //           console.log(GeoJSON)
            
      //       }
      //     } catch (error) {
      //       console.error('Error fetching building coordinates:', error);
      //     }
      //   };
      //   fetchBuildingCoordinates();
      // }, 1000);
    
        
        
    }


  componentDidUpdate(prevProps) {
    if (prevProps.navi !== this.props.navi) 
      // Props have changed, update the state
      if (this.props.navi !== this.state.navi) 
      this.setState({navi: this.props.navi ,
        startLa: this.props.startLa,
        startLo: this.props.startLo,
        endLa: this.props.endLa,
        endLo: this.props.endLo ,
        srch:false,     
      
      });


}

  
  saveMap = (map) => {
    // console.log(map);
    this.map = map;
    this.setState({
      map: map
    });
  };
  
  searchLoc = async(val)=>{

    this.setState({
      srch: false
    });

    console.log("search "+val);

    if (this.state.marker) {
      this.setState({
        marker: null
      });
    } else {
      var f = 0,x,y;

      await axios.get("http://127.0.0.1:5000/depts").then(res=>{
        // console.log(res.data)
        res.data.depts.map((building) => {
          // console.log(building.id)
          const regex = /[^a-z0-9]+/gi;
          const b= building["id"].replace(regex, "");
          if (
            val.toLowerCase() ===
            b.toLowerCase()
          ) {
            
            x = building["y"];
            y = building["x"];
            sessionStorage.setItem("loc",building.id)
            this.setState({
              popup: building.id
            });
            
            f = 1;
            return;
          }
          return 0;
        });
      })
      
      setTimeout(() => {
      if(this.state.data && f!==1){
        this.state.data.map((building) => {
          const regex = /[^a-z0-9]+/gi;
          
          const b= building["ID"].replace(regex, "");
          const c= val.replace(regex, "");
          // console.log(b,c)
          if (
            c.toLowerCase() ===
            b.toLowerCase()
          ) {
            console.log("got it")
            x = building["y"];
            y = building["x"];
            sessionStorage.setItem("loc",building.ID)
            this.setState({
              popup: building.ID
            });
           
            f = 1;
            return;
          }
          return 0;
        })
      }
        if (f === 1) {
          console.log("hello")
          console.log(x, y, this.state.val);
          this.setState({
            srch: true,
            endLa: x,
            endLo: y
          });
          return;
          // this.map.setView(new L.LatLng(x, y), 19);
        } 
        else if(f===0) {
          alert("no such building");
        }
      
      
      }, 1000);
      
    }};   

  handleSearch = async(event) => {
    event.preventDefault(); // Prevent default submission
    this.searchLoc(this.state.val)
    
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

  handleRedirect=()=>{
    const result = window.confirm("Do you want to go to CSE page");
    if (result) {
      window.location.href = '/CSE';
    } else {
      console.log('Cancelled.');
    }
      
      
    }
  render() {
    const position = [this.state.lat, this.state.lng];
    // const { loc, srch } = useLocation().state || {};
    // console.log(this.props.location.state); // 'value1'
    // console.log(loc);

    
    const polygon = [[8.54596, 76.90359 ], [8.54601, 76.90407],  [8.54552, 76.90412],[8.54547, 76.90364]];
    const polygonStyle = {
      opacity: 0.8,
      color: 'black',
      fillColor:'black',
      fillOpacity:0.02,
      weight:0.9 
     };
    var myIcon = L.icon({
      iconUrl: location,
      iconSize: [50, 50]
    });
    // const buildingGeoJSON = {
    //   type: 'Point',
    //   coordinates: this.state.buildingCoordinates,
    // };

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
            { this.state.GeoJSON &&
              <GeoJSON
              data={this.state.buildingGeoJSON}
              pointToLayer={(feature, latlng) => {
                return L.circleMarker(latlng, { radius: 10, color: 'red', fillColor: 'yellow' });
              }}
            />
            }
            {this.state.srch &&  (
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
                  {/* <div style=
                      {{color: "black",
                      fill: "black",
                      fillOpacity: 0.4,
                      opacity: 0.8,
                      weight: 1}}> */}
                  <Polygon
                    positions={polygon} 
                    pathOptions={polygonStyle}
                    
                    onClick={this.handleRedirect}

                  >
                    <Tooltip permanent>
                      
                      {this.state.popup}</Tooltip>
                  </Polygon>
                  {/* </div> */}
                  
                </Marker>
              </div>
            )}
            
            
            {this.state.navi && (<div>
              <Routing
                map={this.map}
                startLoc={[this.state.startLa, this.state.startLo]}
                endLoc={[this.state.endLa, this.state.endLo]}
              />
              <Marker
                  position={[this.state.endLa, this.state.endLo]}
                  icon={myIcon}
                  onAdd={(e) => {
                    e.target.openPopup();
                    this.recenter();
                  }}>

                  <Polygon
                    positions={polygon} 
                    pathOptions={polygonStyle}
                    
                    onClick={this.handleRedirect}

                  >
                    <Tooltip permanent>{this.state.popup}</Tooltip>
                  </Polygon>

                  
                </Marker>
            </div>
              
            )}

          </Map>
        </div>
      </div>
    );
  }
}
