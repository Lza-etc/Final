import React,{useState,useEffect} from 'react'
import {Navbar,Container,Nav,NavDropdown} from "react-bootstrap";
import axios from "axios";
import "../styles/Navbar.css";
import CetMap from './CetMap';
import { useNavigate } from "react-router-dom";

const  Navigationbar=({nav,setNav,navi,setNavi,startLa,setStarLa,startLo,setStarLo,endLa,setEndLa,endLo,setEndLo}) => {
  const navigate = useNavigate();
  const  [showDeptNav, setShowDeptNav] = useState(false)
  const [startloc, setStartLoc] = useState("");
  const [destiloc,setDestiLoc]=useState("");
  const [isCancelled, setIsCancelled] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const [data,setData]=useState([])
  
 


  useEffect(() => {
    const loc=sessionStorage.getItem("loc")
    if(loc){
      setDestiLoc(loc)
    }
    if(destiloc){
      setDestiLoc(loc)
    }
     
    const fetchData = async () => {
      
    const apiUrls = [
      'http://127.0.0.1:5000/floors/cse',
      'http://127.0.0.1:5000/floors/mca',
      'http://127.0.0.1:5000/floors/eee',
      'http://127.0.0.1:5000/floors/ec1',
      'http://127.0.0.1:5000/floors/ec2',
      'http://127.0.0.1:5000/floors/ce1',
      'http://127.0.0.1:5000/floors/me1',
      'http://127.0.0.1:5000/floors/me2',
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
        setData(combinedResponse);
        console.log(combinedResponse)
      })
      .catch(error => {
        console.error('Error:', error);
      });
      };   
    fetchData();
    
  }, []);


  const onChangeStart = (event) => {
    // if (!isCancelled)
    setStartLoc(event.target.value);
    
  };

  const onChangeDesti = (event) => {
    // if (!isCancelled)
    setDestiLoc(event.target.value);
  };

  const handleCancel = () => {
    setStartLoc('');
    setDestiLoc('');
    sessionStorage.removeItem("src");
    sessionStorage.removeItem("dest");
    sessionStorage.setItem("cancel",1)
    sessionStorage.setItem("spath",1);
    setIsCancelled(true);
  }

  const handleNavi = async(event) => {
    sessionStorage.setItem("spath",1);
    try {
      var startLo,startLa,endLa,endLo,fs=0,fd=0;
      console.log(startloc+" "+destiloc)
      sessionStorage.setItem("navi",true)
      await axios.get("http://127.0.0.1:5000/depts").then(res=>{

        res.data.depts.map((building) => {

          const regex = /[^a-z0-9]+/gi;
            const b= building["id"].replace(regex, "");
            if (
              startloc.toLowerCase() ===
              b.toLowerCase()
            ) {
              startLa = building.y;
              startLo = building.x;
              sessionStorage.setItem("sx",building.x)
              sessionStorage.setItem("sy",building.y)
              sessionStorage.setItem("sz",building.z)
              sessionStorage.setItem("src",building.id) 
              fs = 1;
              return;
            }
          return 0;
        });
      res.data.depts.map((building) => {

        const regex = /[^a-z0-9]+/gi;
          const b= building["id"].replace(regex, "");
          if (
            destiloc.toLowerCase() ===
            b.toLowerCase()
          ) {
            endLa = building.y;
            endLo = building.x;
            sessionStorage.setItem("dx",building.x)
            sessionStorage.setItem("dy",building.y)
            sessionStorage.setItem("dz",building.z)
            sessionStorage.setItem("dest",building.id)
            fd = 1;
            return;
          }
        return 0;
      });
    })
      
      setTimeout(() => {

        if(fs===0)
        data.map((building) => {

          const regex = /[^a-z0-9]+/gi;
            const b= building.ID.replace(regex, "");
            const c= startloc.replace(regex, "");
            // console.log(b,c)
            if (
              c.toLowerCase() ===
              b.toLowerCase()
            ) {
              startLa = building.y;
              startLo = building.x;
              sessionStorage.setItem("sx",building.x)
              sessionStorage.setItem("sy",building.y)
              sessionStorage.setItem("sz",building.z)
              sessionStorage.setItem("src",building.ID) 
              fs = 1;
              return;
            }
          return 0;
        });

        if(fd===0)
      data.map((building) => {

        const regex = /[^a-z0-9]+/gi;
        
          const b= building.ID.replace(regex, "");
          const c= destiloc.replace(regex, "");
          // console.log(b,c)
          if (
            c.toLowerCase() ===
            b.toLowerCase()
          ) {
            endLa = building.y;
            endLo = building.x;
            sessionStorage.setItem("dx",building.x)
            sessionStorage.setItem("dy",building.y)
            sessionStorage.setItem("dz",building.z)
            sessionStorage.setItem("dest",building.ID)
            fd = 1;
            return;
          }
        return 0;
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
      }else if(fd===0){
        alert("no such ending location");
      }
      }, 3000);

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
          <Nav className="rightSide">
            <Nav.Link
              href="/dept"
              onClick={() => {
                setNav(true);
              }}
            >
              Department
            </Nav.Link>
            {/* <Nav.Link href="/Event">Events</Nav.Link> */}
            <div
              className="nav-sec"
              onClick={() => {
                setShowDeptNav(!showDeptNav);
              }}
            >
              Navigation
            </div>
            {userId ? (
                <Nav.Link href="/profile">Profile</Nav.Link>
            ):(
              <Nav.Link href="/Event">Events</Nav.Link>
            )}
            {userId ? (
                <div
                  className="nav-sec"
                  onClick={() => {
                    sessionStorage.removeItem("userId");
                    navigate("/");
                  }}
                >
                  Logout
                </div>
            ) : (
              <div>
                
                <Nav.Link href="/Login">Login</Nav.Link>
              </div>
            )}
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
