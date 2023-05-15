import React, { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navigationbar from "./components/Navbar";
import Event from "./pages/Event";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DeptMap from "./components/Department";
import Mca from "./pages/Mca";
import Cse from "./pages/Cse";
import Civil from "./pages/Civil";
import Eee from "./pages/Eee";
import Profile from "./pages/Profile";
import About from "./pages/About";
import AddEvent from "./pages/addevent";
import ShowEvent from "./pages/ShowEvent";
import Location from "./pages/Location";
import Org from "./pages/Org";
// import Navigation from "./pages/Navigation";

function App() {
  const[nav,setNav]=useState(true)
  const [startLo,setStarLo]=useState(null);
  const [startLa,setStarLa]=useState(null);
  const [endLo,setEndLo]=useState(null);
  const [endLa,setEndLa]=useState(null);
  const [navi,setNavi]=useState(false);
 
  return (
    <div className="App">
      
      <Router>
        <Navigationbar nav={nav} setNav={setNav} navi={navi} setNavi={setNavi} endLa={endLa} setEndLo={setEndLo} setEndLa={setEndLa} setStarLa={setStarLa
        } setStarLo={setStarLo} endLo={endLo} startLa={startLa} startLo={startLo}/>
       < Routes >
          <Route path="/" element={<Home nav={nav} navi={navi} endLa={endLa} endLo={endLo} startLa={startLa} startLo={startLo}/>} />
          <Route path="/MCA" element={<Mca/>} />
          <Route path="/CSE" element={<Cse/>} /> 
          {/* <Route path="/Navi" element={<Navigation />} /> */}
          <Route path="/CIVIL" element={<Civil/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/event" element={<Event/>} />
          <Route path="/dept" element={<DeptMap nav={nav} />} />
          <Route path="/EEE" element={<Eee/>} /> 
          <Route path="/profile" element={<Profile/>} />
          <Route path="/About" element={<About/>} />
          <Route path="/AddEvent" element={<AddEvent/>} />
          <Route path="/ShowEvent" element={<ShowEvent/>} />
          <Route path="/Org" element={<Org/>} />
          <Route path="/Location" element={<Location/>} />
        </ Routes  > 
          

      </Router>
    </div>
  );
}

export default App;
