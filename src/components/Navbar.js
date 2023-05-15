import React,{useState} from 'react'
import {Navbar,Container,Nav,NavDropdown} from "react-bootstrap";
import axios from "axios";
import "../styles/Navbar.css";
import CetMap from './CetMap';

const  Navigationbar=({nav,setNav,navi,setNavi,startLa,setStarLa,startLo,setStarLo,endLa,setEndLa,endLo,setEndLo}) => {
  const  [showDeptNav, setShowDeptNav] = useState(false)
  const [startloc, setStartLoc] = useState("");
  const [destiloc,setDestiLoc]=useState("");
  const [isCancelled, setIsCancelled] = useState(false);

  const onChangeStart = (event) => {
    if (!isCancelled)
    setStartLoc(event.target.value);
    
  };

  const onChangeDesti = (event) => {
    if (!isCancelled)
    setDestiLoc(event.target.value);
  };

  const handleCancel = () => {
    setStartLoc('');
    setDestiLoc('');
    setIsCancelled(true);
  }

  const handleNavi = async(event) => {
    try {
      var startLo,startLa,endLa,endLo,fs=0,fd=0;
      console.log(startloc+" "+destiloc)
      await axios.get("http://127.0.0.1:5000/depts").then(res =>{
          res.data.depts.map((building) => {
            const regex = /[^a-z0-9]+/gi;
            const b= building["id"].replace(regex, "");
            if (
              startloc.toLowerCase() ===
              b.toLowerCase()
            ) {
              startLa = building["y"];
              startLo = building["x"];
              fs = 1;
            }
            else if (
              destiloc.toLowerCase() ===
              b.toLowerCase()
            ) {
              endLa = building["y"];
              endLo = building["x"];
              fd = 1;
            }
          });
          if (fs === 1 && fd===1) {
            setStarLa(startLa);
            setStarLo(startLo);
            setEndLa(endLa);
            setEndLo(endLo);
            setNavi(true);
            // console.log(startLa+" "+startLo+"navbar");
          } else if (fs===0){
            
            alert("no such starting location");
          }else {
            alert("no such ending location");
          }
        });
    } catch (err) {
      console.log(err);
      console.log("Dept API call inside navbar not complete");
    }
  }
  return (
    <Navbar  className='navbar' collapseOnSelect expand="lg" >
      <Container>
        <Navbar.Brand className='leftSide' href="/" >CETgo</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className='rightSide'>
            <Nav.Link href="/dept" onClick={() => {
              setNav(true)}}>Department</Nav.Link>
            <Nav.Link href="/profile">Profile</Nav.Link>
            <div className='nav-sec'onClick={() => {setShowDeptNav(!showDeptNav)}}>Navigation</div>
            <Nav.Link href="/Login">Login</Nav.Link>
            <Nav.Link href="/Event">Events</Nav.Link>
            {/* <NavDropdown title="More" id="collasible-nav-dropdown">
              <NavDropdown.Item classname='drop-down'  href="#action/3.1">Emergency Contact</NavDropdown.Item>
              <NavDropdown.Item classname='drop-down' href="#action/3.2">Exam Hall Search</NavDropdown.Item>
              <NavDropdown.Item classname='drop-down' href="#action/3.3">About Us</NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
        <div className='dept-nav' hidden={!showDeptNav}>
            <input className='dept-nav-loc'type="text" value={startloc} onChange={onChangeStart} placeholder="Start Location"/>
            <input className='dept-nav-loc' type="text" value={destiloc} onChange={onChangeDesti} placeholder="Destination"/>
            <div className='dept-nav-btn'>
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleNavi}>Find Route</button>
            </div>
          </div>
      </Container>
    </Navbar>
)
}

export default Navigationbar;
