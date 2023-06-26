import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Eee.css";
import axios from "axios";
import { Slider } from "@mui/material";
import splitPath from "./path_split.js";
import {DrawArrowHead} from "../components/DrawArrowHead";

var spath=1;
var x=0,y=0;
var slider=1;
const loc=sessionStorage.getItem("loc")
if(loc){
  if(loc[3]==='1'){
    slider=1;
  }
  else if(loc[3]==='2'){
    slider=2
  }
  else if(loc[3]==='3'){
    slider=3;
  }
  else if(loc[3]==='C'){
    slider=0;
  }
}
else{
  slider=1;
}

function Eee() {
  
  const canvasRef = useRef(null);

  const [p1,setP1]=useState([])
  const [p2,setP2]=useState([])
  const [p3,setP3]=useState([])
  const [p0,setP0]=useState([])
  const [sliderValue, setSliderValue] = useState(0);
  const [floorPath, setFloorPath] = useState(p1);
  const floorData = [ "https://raw.githubusercontent.com/Lza-etc/imageData/main/Eeeb.png", "https://raw.githubusercontent.com/Lza-etc/imageData/main/Eee0.png", "https://raw.githubusercontent.com/Lza-etc/imageData/main/Eee1.png","https://raw.githubusercontent.com/Lza-etc/imageData/main/Eee2.png"];
  const [currentImage, setCurrentImage] = useState( "https://raw.githubusercontent.com/Lza-etc/imageData/main/Eeeb.png");
  const [floorImg, setFloorImage] = useState(0);


  const src=sessionStorage.getItem("src")
  const dest=sessionStorage.getItem("dest")
  const dept=sessionStorage.getItem("dept")
  const [data,setData]=useState([])

  useEffect(() => {
    if(dept!=="eee"){
      sessionStorage.setItem("dept","eee");
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    var z=0;
    // console.log("useEffects")
    if(loc)
    setRadius(30)

    const img = new Image();
    img.src = currentImage;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const fetchData = async () => {
      // const s=sessionStorage.getItem("slider")
    //   if(s !==floorImg){
    //     setFloorImage(s);
    //     // sessionStorage.setItem("val",s)
    //     setCurrentImage(floorData[s])
    // } 

    if(src && dest && spath){
      spath=0;
      shortestPath(src,dest).then(res=>{
        console.log("shortest path complete")
        
      })
    }
  
    await axios.get("http://127.0.0.1:5000/floors/eee").then(res=>{
        console.log(res)
        setData(res);
    })
      .catch(error => {
        console.error('Error:', error);
      });

      setTimeout(() => {
      console.log("loc"+loc)
      if(data && loc )
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
          x=building.fx;
          y=building.fy;
          z=building.z;
          // sessionStorage.setItem("cx",building.fx)
          // sessionStorage.setItem("cy",building.fy)
          // console.log(building.fx,building.fy,building.z)
          return;
        }
        return 0;
      })
      // if (f === 1) {
      //   console.log(x, y, loc);
      // } 
        }, 1000);
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
       
        // console.log(z,slider)
        // console.log(loc,x)
        if(loc && x && z==slider){
          
          context.beginPath();
          
          console.log(x,y)
          context.arc(x*3.6, y*3.6, 20, 0, 2 * Math.PI);
          context.fillStyle = "blue";
          context.fill();
          context.closePath();
          
          // Draw the text
          context.font = '40px Arial';
          context.fillStyle = "red";
          context.fillText(dest, x, y+60);
          // sessionStorage.removeItem("loc");
          
        }
        if (slider !== floorImg) {
          setFloorImage(slider);
          setCurrentImage(floorData[slider]);
          setSliderValue(slider*33);
        }
      
    }, 3000);
   
      
      if(floorPath && floorPath.length!=0){
        context.beginPath()
        context.moveTo(floorPath[0][0],floorPath[0][1])
        for(var i=1;i<floorPath.length;i++){
          context.lineTo(floorPath[i][0],floorPath[i][1])
        }
        context.lineWidth = 9;
        context.stroke()
        context.closePath()
        for (var i = 2; i < floorPath.length; i++) {
          DrawArrowHead(context, floorPath[i - 1], floorPath[i]);
        }
      }     
    };
  }, [currentImage]);

  const marks = [
    {
      value: 0,
      label: "Basement Floor",
    },
    {
      value: 33,
      label: "Ground Floor",
    },
    {
      value: 66,
      label: "First Floor",
    },
    {
      value: 99,
      label: "Second Floor",
    },
  ];


  const shortestPath=async(src,dest)=>{
    if(src[0]!=='E'&&src[1]!=='E'){
      src="EE_start"
    }
    
    try {
      await axios.post('http://127.0.0.1:5000/shortestpath', { 
        src:src,
        dest:dest,
        dept:"eee"
       },{
        headers: {
          'Content-Type': 'application/json'
        }}).then(res=>{
        // console.log(res.data.path);
        var p = splitPath(res.data.path, 3)
        
        console.log("newwwwww extra paths")
        console.log(p.path)
        
        if(p.path[0])
          setP1(Array.from(p.path[0], x => [3.6*x[0], 3.6*x[1]]))
        if(p.path[1])
          setP2(Array.from(p.path[1], x => [3.6*x[0], 3.6*x[1]]))
        if(p.path[2])
          setP3(Array.from(p.path[2], x => [3.6*x[0], 3.6*x[1]]))
        if(p.path[3])
          setP3(Array.from(p.path[3], x => [3.6*x[0], 3.6*x[1]]))
        // console.log(p1,p2,p3)
        console.log(p.ids)
       })
      // Handle the response data
      
    } catch (error) {
      // Handle the error
      console.error("EEEerror",error);
    }

  }
  if(src && dest && spath){
    spath=0;
    shortestPath(src,dest).then(res=>{
      console.log("shortest path complete")
      
    })
  }

  const handleImageChange = (e, val) => {
    console.log(val)
    slider=val/33;
    if (val / 33 !== floorImg){
      setFloorImage(val / 33);
      setCurrentImage(floorData[val / 33]);

      if(val===0)
      setFloorPath(p0);
    else if(val===33)
      setFloorPath(p1);
    else if(val===66)
      setFloorPath(p2);
    else if(val===99)
      setFloorPath(p3);
    }
  };


  return (
    <div>
      <div className="eee-main">
        <div className="eee-left text-center">
          <Link to="/CSE" className="left-nav-links ">
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
          <Link to="/EEE" className="left-nav-links left-active-link">
            EEE
          </Link>
        </div>
        <div className="d-flex justify-content-around w-90">
          <div className="eee-mid">
            <canvas ref={canvasRef} style={{ height: "calc(100vh - 71px)" }} />
          </div>
          <div className="eee-right">
            <Slider
              aria-label="Custom marks"
              defaultValue={0}
              step={33}
              max={99}
              value={sliderValue}
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
export default Eee;

