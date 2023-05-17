import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {Nav,Button,Form} from "react-bootstrap";
import "../styles/Cse.css";
import axios from "axios";
import { Slider } from "@mui/material";
// import { pathSplit } from "./path_split";

function Cse() {
  const canvasRef = useRef(null);
  // const sliderRef = useRef(null);
  
  // const p1=[[950,700],[2125,700],[2125,900]]
  //  const p2=[[950,700],[2125,700]]
  //   const p3=[[2125,700],[2125,900]]
  const [p1,setP1]=useState([]);
  const [p2,setP2]=useState([]);
  const [p3,setP3]=useState([]);
  const floorData = ["images/CSE0.png", "images/CSE1.png", "images/CSE2.png"];
  const [currentImage, setCurrentImage] = useState("images/CSE0.png");
  const [floorImg, setFloorImage] = useState(0);
  const [floorPath, setFloorPath] = useState(p1);
  const [locationImg,setLocationImg]=useState(0);
  const [centerX,setCenterX] =useState(0);
  const [centerY,setCenterY] =useState(0);
  // const [loc,setLoc] =useState(0);
  const loc=sessionStorage.getItem("loc")
  const src=sessionStorage.getItem("src")
  const dest=sessionStorage.getItem("dest")
  const [data,setData]=useState([])
  const [radius,setRadius]=useState(0)
  const [over,setOver]=useState(0);
  var val=0;
    if(loc){
      if(loc[3]==='1'){
        val=0;
      }
      else if(loc[3]==='2'){
        val=1
      }
      else if(loc[3]==='3'){
        val=2;
      }
      console.log(loc,val)
      sessionStorage.setItem("slider",val)
}
else{
  sessionStorage.setItem("slider",0)
}
 


  useEffect(() => {
    // setLoc(sessionStorage.getItem("loc"));
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    
    if(loc)
    setRadius(30)
    
    const img = new Image();
    img.src = currentImage;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const fetchData = async () => {
      if(val!==floorImg){
        setFloorImage(val);
        sessionStorage.setItem("val",val)
        setCurrentImage(floorData[val])
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
        setData(combinedResponse);
      })
      .catch(error => {
        console.error('Error:', error);
      });

      setTimeout(() => {
      if(data && loc)
      data.map((building) => {
        const regex = /[^a-z0-9]+/gi;
        
        const b= building["ID"].replace(regex, "");
        const c= loc.replace(regex, "");
        // console.log(b,c)
        if (
          c.toLowerCase() ===
          b.toLowerCase()
        ) {
          console.log("got it")
          setCenterX(building.fx)
          setCenterY(building.fy)
          console.log(building.fx,building.fy)
          return;
        }
        return 0;
      })
      // if (f === 1) {
      //   console.log(x, y, loc);
      // } 
        }, 2000);
      };   

    fetchData();

    
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      context.lineWidth = 20; 
      context.strokeStyle = "red";
      
      setTimeout(() => {
        // Draw the circle

        if(loc){
          context.beginPath();
          context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          context.fillStyle = "red";
          context.fill();
          context.closePath();
          
          // Draw the text
          context.font = '40px Arial';
          context.fillStyle = "red";
          context.fillText(loc, centerX, centerY+60);
          // sessionStorage.removeItem("loc");
          
        }
      
    }, 5000);
   
      
      if(floorPath && floorPath.length!=0){
        context.beginPath()
        context.moveTo(floorPath[0][0],floorPath[0][1])
        for(var i=1;i<floorPath.length;i++){
          context.lineTo(floorPath[i][0],floorPath[i][1])
        }
        context.stroke()
        context.closePath()
      }     
    };
  sessionStorage.removeItem("loc")  


  if(src && dest && !over){
    shortestPath(src,dest).then(res=>{
      console.log("shortest path complete")
      setOver(1)
    })
  }
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

  const shortestPath=async(src,dest)=>{
    
    try {
      await axios.post('http://127.0.0.1:5000/shortestpath', { 
        src:src,
        dest:dest,
        dept:"cse"
       },{
        headers: {
          'Content-Type': 'application/json'
        }}).then(res=>{
        console.log(res.data.path);

        var cp1=[],cp2=[],cp3=[],stair=[],cur;
        var stairx,stairy,x,y;
        var curp=-1;
        res.data.path.map((point)=>{

          x=parseInt(point.fx);
          y=parseInt(point.fy)
          // console.log(point.id[3])
          if(point.id[3]==='1'){
            
            if(curp==3){
              stair=[stairx+1400,stairy+1110]
              cp1=[...cp1,stair]
            }
            cur=[x+1400,y+1110]
            cp1=[...cp1,cur]
            curp=0
          }
          else if(point.id[3]==='2'){
            if(curp==3){
              stair=[stairx+1100,stairy+1110]
              cp1=[...cp1,stair]
              
            }
            cur=[x+1400,y+1110]
            cp2=[...cp2,cur]
            curp=1
          }
          else if(point.id[3]==='3'){
            
            if(curp==3){
              console.log(stair)
              stair=[stairx+1400,stairy+1000]
              cp3=[...cp3,stair]
              
            }
            cur=[x+1400,y+1110]
            cp3=[...cp3,cur]
            curp=2
          }
          else if(point.id[3]==='S'){
            stairx=x;
            stairy=y;
            
            if(curp===0){
              stair=[stairx+1110,stairy+1110]
              cp1=[...cp1,stair]
            }
            else if(curp===1){
              stair=[stairx+1110,stairy+1110]
              cp2=[...cp2,stair]
            }
            else if(curp===2){
              stair=[stairx+1000,stairy+1000]
              cp3=[...cp3,stair]
            }
            curp=3;
          }
        })
        console.log("cp1")
        console.log(cp1);
        console.log("cp2")
        console.log(cp2);
        console.log("cp3")
        console.log(cp3);
        setP1(cp1);
        setP2(cp2);
        setP3(cp3)
       })
      // Handle the response data
      
    } catch (error) {
      // Handle the error
      console.error("CSEerror");
    }

  }
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
            <Link to="/MAIN" className='left-nav-links'>
            MECH
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
              defaultValue={parseInt(sessionStorage.getItem("slider"))*50}
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
