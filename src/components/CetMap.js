import React, { Component } from "react";
import L from "leaflet";
import { useLocation } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup, Polygon, Tooltip, GeoJSON } from "react-leaflet";
// // import fuzzball from 'fuzzball';

import { Nav, Button, Form } from "react-bootstrap";
import location from "../assets/location.png";
// import data from "../assets/cet_main.json";
import Routing from "./RoutingMachine";
import polygon from "../assets/Polygon"
import "../styles/CetMap.css";


import axios from 'axios';
// import Fuse from 'fuse.js';
// import { useFloorData } from '../hooks/useFloorData';
// import getFloors from "../api/getFloors"



export default class CetMap extends Component {

  state = {
    lat: 8.54592,
    lng: 76.90623,
    zoom: 17.5,
    val: null,
    marker: null,
    map: null,
    srch: false,
    endLa: this.props.startLa,
    endLo: this.props.startLng,
    popup: ""
  };

  prevSessionStorageValue = sessionStorage.getItem('loc');
  constructor(props) {
    super(props);
    this.state = {
      lat: 8.54592,
      lng: 76.90623,
      zoom: 17.5,
      val: sessionStorage.getItem("loc"),
      marker: null,
      map: null,
      srch: false,
      navi: this.props.navi,
      startLa: this.props.startLa,
      startLo: this.props.startLo,
      endLa: this.props.endLa,
      endLo: this.props.endLo,
      data: null,
      popup: "",
    };

  }




  componentDidMount() {

    const srch = sessionStorage.getItem("srch");
    const val = sessionStorage.getItem("loc");

    if (srch && val) {
      sessionStorage.setItem("dest", val)
      this.setState({
        val: val
      })
      var f = this.searchLoc(val)
      if (f && f === 0)
        console.log("no such building");
      sessionStorage.removeItem('srch')
    }
    else
      sessionStorage.removeItem("loc")
    this.fetchRooms();
  }

  // findMostProbableMatch = (input, array, property) => {
  //   let bestMatch = null;
  //   let bestMatchScore = 0;

  //   array.forEach((element) => {
  //     const elementProperty = element[property];
  //     const score = fuzzball.token_sort_ratio(input, elementProperty);
  //     if (score > bestMatchScore) {
  //       bestMatch = element;
  //       bestMatchScore = score;
  //     }
  //   });

  //   return bestMatch;
  // }


  fetchRooms = async () => {
    const apiUrls = [
      'http://127.0.0.1:5000/floors/cse',
      'http://127.0.0.1:5000/floors/mca',
      'http://127.0.0.1:5000/floors/eee',
      'http://127.0.0.1:5000/floors/ec1',
      'http://127.0.0.1:5000/floors/ec2',
      'http://127.0.0.1:5000/floors/ce1',
      'http://127.0.0.1:5000/floors/ce2',
      'http://127.0.0.1:5000/floors/arch',
      'http://127.0.0.1:5000/floors/me1',
      'http://127.0.0.1:5000/floors/me2',
    ];

    const apiRequests = apiUrls.map(url => fetch(url).then(response => response.json()));

    Promise.all(apiRequests)
      .then(responses => {
        var combinedResponse = [];
        responses.forEach((response, index) => {
          combinedResponse = [...combinedResponse, ...response.rooms];
        });

        this.setState({
          data: combinedResponse
        })
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }


  componentDidUpdate(prevProps) {
    sessionStorage.setItem("dept","");
    if (prevProps.navi !== this.props.navi)
      // Props have changed, update the state
      if (this.props.navi !== this.state.navi)
        this.setState({
          navi: this.props.navi,
          startLa: this.props.startLa,
          startLo: this.props.startLo,
          endLa: this.props.endLa,
          endLo: this.props.endLo,
          srch: false,

        });
  }



  saveMap = (map) => {
    // console.log(map);
    this.map = map;
    this.setState({
      map: map
    });
  };
  // performFuzzySearch = (input, array, parameter) => {
  //   const fuse = new Fuse(array, {
  //     keys: [
  //       {
  //         name: parameter,
  //         weight: 1,
  //         isCaseSensitive: false,
  //         includeScore: true,
  //         includeMatches: true,
  //         minMatchCharLength: 2,
  //       }
  //     ],
  //     includeScore: true,
  //     threshold: 0.4,
  //   });

  //   const results = fuse.search(input);

  //   return results.map((result) => result.item);
  // }

  searchLoc = async (val) => {
    // await axios.get("http://127.0.0.1:5000/point/"+val).then(res=>{
    //   console.log("fuzzy output",res)
    // }
    // )

    this.setState({
      srch: false
    });
    console.log("search " + val);
    if (this.state.marker) {
      this.setState({
        marker: null
      });
    } 
    
    else{

      // var f = 0, x, y;
      // await axios.get("http://127.0.0.1:5000/depts").then(res => {
      //   // console.log(res.data)
      //   res.data.depts.map((building) => {
      //     // console.log(building.id)
      //     const regex = /[^a-z0-9]+/gi;
      //     const b = building["id"].replace(regex, "");
      //     if (
      //       val.toLowerCase() ===
      //       b.toLowerCase()
      //     ) {

      //       x = building["y"];
      //       y = building["x"];
      //       sessionStorage.setItem("loc", building.id)
      //       this.setState({
      //         popup: building.id
      //       });

      //       f = 1;
      //       return;
      //     }
      //     return 0;
      //   });

        var f = 0, x, y;

        await axios.get("http://127.0.0.1:5000/depts").then(res => {
          // console.log(res.data)
          // const searchResults = this.performFuzzySearch(val, res.data.depts, 'id');
          // console.log(searchResults)
          // if (searchResults.size === 0)
          //   console.log("ZEROOO match")
          // else
          //   searchResults.map((b) => {
          //     console.log(b.id)
          //   })
          res.data.depts.map((building) => {
            // console.log(building.id)
            const regex = /[^a-z0-9]+/gi;
            const b = building["id"].replace(regex, "");
            if (
              val.toLowerCase() ===
              b.toLowerCase()
            ) {

              x = building["y"];
              y = building["x"];
              sessionStorage.setItem("loc", building.id)
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
          if (this.state.data && f !== 1) {
            // const mostProbableMatch = this.findMostProbableMatch(val, this.state.data, ID);
            // console.log("FuzzySearch   ",mostProbableMatch)
            // const searchResults = this.performFuzzySearch(val, this.state.data, 'ID');
            // console.log(searchResults)
            // if (searchResults.size === 0)
            //   console.log("ZEROOO match")
            // else
            //   searchResults.map((b) => {
            //     console.log(b.ID)
            //   })
            this.state.data.map((building) => {
              const regex = /[^a-z0-9]+/gi;

              const b = building["ID"].replace(regex, "");
              const c = val.replace(regex, "");
              // console.log(b,c)
              if (
                c.toLowerCase() ===
                b.toLowerCase()
              ) {
                console.log("got it")
                x = building["y"];
                y = building["x"];
                sessionStorage.setItem("loc", building.ID)
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
          else if (f === 0) {
            alert("no such building");
          }


        }, 1000);

      }
    };

    handleSearch = async (event) => {
      event.preventDefault(); // Prevent default submission
      this.searchLoc(this.state.val)

    };
    recenter = () => {
      this.setState({
        lat: this.state.endLa,
        lng: this.state.endLo,
        zoom: 18.25
      });
    };

    onChange = (event) => {
      this.setState({
        val: event
      });
    };




    handleRedirect = (name) => {
      const result = window.confirm("Do you want to go to " + name + " page");
      if (result) {
        window.location.href = '/' + name;
      } else {
        console.log('Cancelled.');
      }


    }

    render() {
      const position = [this.state.lat, this.state.lng];
      // const { loc, srch } = useLocation().state || {};
      // console.log(this.props.location.state); // 'value1'
      // console.log(loc);

      const buildingCoordinates = this.state.buildingCoordinates;
      console.log(buildingCoordinates)

      // if (!buildingCoordinates) {
      //   return null; // Render nothing while fetching coordinates
      // }

      const southWest = L.latLng(8.5405,76.9001); // Define the southwest boundary coordinates
      const northEast = L.latLng(8.5501,76.9093); // Define the northeast boundary coordinates
      const bounds = L.latLngBounds(southWest, northEast); 

      const polygonStyle = {
        fillColor: 'orange',
        fillOpacity: 0.1,
        color: 'orange',
        weight: 2,

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
                  value={sessionStorage.getItem("loc")}
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
            <Map center={position} zoom={this.state.zoom}  maxZoom={20} maxBounds={bounds} ref={this.saveMap}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />



              {

                polygon.map((p) => (

                  <GeoJSON data={{
                    type: 'Polygon',
                    coordinates: [p.poly],
                  }} style={polygonStyle}
                    onClick={() => this.handleRedirect(p.name)}
                  />

                ))
              }

              {/* <Polygon
                    positions={polygon} 
                    pathOptions={polygonStyle}
                    
                    onClick={this.handleRedirect}

                  >
                    <Tooltip permanent>
                      
                      {this.state.popup}</Tooltip>
                  </Polygon> */}
              {/* <a href="/CIVIL"> */}
              {/* <GeoJSON data={polygonData} style={polygonStyle} /> */}
              {/* </a> */}
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
                    {/* <div style=
                      {{color: "black",
                      fill: "black",
                      fillOpacity: 0.4,
                      opacity: 0.8,
                      weight: 1}}> */}

                    {/* </div> */}
                    <Tooltip direction="top" offset={[0, -35]} permanent>{this.state.popup}</Tooltip>

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

                  {/* <Polygon
                  positions={polygon}
                  pathOptions={polygonStyle}

                  onClick={this.handleRedirect}

                >
                  <Tooltip direction="top" offset={[0, -35]} permanent>{this.state.popup}</Tooltip>

                  </Polygon> */}
                </Marker>
              </div>

              )}

            </Map>
          </div>
        </div>
      );
    }
  }
