import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {Nav,Button,Form} from "react-bootstrap";
import "../styles/Cse.css";
import { Slider } from "@mui/material";

function Cse() {
  const canvasRef = useRef(null);
  
  const p1=[[950,700],[2125,700],[2125,900]]
   const p2=[[950,700],[2125,700]]
    const p3=[[2125,700],[2125,900]]
  const floorData = ["images/CSE0.png", "images/CSE1.png", "images/CSE2.png"];
  const [currentImage, setCurrentImage] = useState("images/CSE0.png");
  const [floorImg, setFloorImage] = useState(0);
  const [floorPath, setFloorPath] = useState(p1);
  const [locationImg,setLocationImg]=useState(0);


  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const img = new Image();
    img.src = currentImage;
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      context.lineWidth = 20; 
      context.strokeStyle = "red";
      
      if(floorPath.length!=0){
        context.beginPath()
        context.moveTo(floorPath[0][0],floorPath[0][1])
        for(var i=1;i<floorPath.length;i++){
          context.lineTo(floorPath[i][0],floorPath[i][1])
        }
        context.stroke()
        context.closePath()
      }     
    };
  }, [currentImage]);

  const marks = [
    {
      value: 0,
      label: "Ground Floor",
    },
    {
      value: 50,
      label: "First Floor",
    },
    {
      value: 100,
      label: "Second Floor",
    },
  ];

  const handleImageChange = (e, val) => {
    if (val / 50 !== floorImg) {
      setFloorImage(val / 50);
      setCurrentImage(floorData[val / 50]);
      
      if(val===0)
      setFloorPath(p1);
      else if(val===50)
        setFloorPath(p2);
      else if(val===100)
        setFloorPath(p3);
    }
  };
  // const handleClick = (event) => {
  //   event.preventDefault(); // Prevent default submission
  //   if (locationImg) {
  //     context.drawImage(img, 0, 0, canvas.width, canvas.height);
  //   }
  // };

  // const onChange = (event) => {
  //   setValue(event.target.value);
  // };

  return (
    <div>
      <div className="cse-main">
      {/* <div  className='search-btn '>
        <Nav className="me-auto">
          <Form className="d-flex" >
          <Form.Control
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
            onChange={onChange}
          />
          <Button className='search-side-btn'  variant="outline-success" onClick={handleClick} >Search</Button>
        </Form>
           
        </Nav>
      </div> */}
        <div className="cse-left text-center">
          <Link to="/CSE" className="left-nav-links left-active-link">
            CSE
          </Link>
          <Link to="/MCA" className="left-nav-links">
            MCA
          </Link>
          <Link to="/CIVIL" className="left-nav-links ">
            CIVIL
          </Link>
          <Link to="/EEE" className="left-nav-links">
            EEE
          </Link>
        </div>
        <div className="d-flex justify-content-around w-100">
          <div className="cse-mid">
            <canvas ref={canvasRef} style={{ height: "calc(100vh - 71px)" }} />
          </div>
          <div className="cse-right">
            <Slider
              aria-label="Custom marks"
              defaultValue={0}
              step={50}
              orientation="vertical"
              valueLabelDisplay="off"
              marks={marks}
              onChange={handleImageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Cse;