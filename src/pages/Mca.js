import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom"
import "../styles/Mca.css"
import axios from "axios";
import { Slider } from "@mui/material";
import splitPath from "./path_split.js";


var spath=1;
var x=0,y=0;
var slider=0;
const loc=sessionStorage.getItem("loc")
if(loc){
  if(loc[3]==='1'){
    slider=0;
  }
  else if(loc[3]==='2'){
    slider=1
  }
  else if(loc[3]==='3'){
    slider=2;
  }
}
else{
  slider=0;
}


function Mca() {
  const canvasRef = useRef(null);

  const [p1,setP1]=useState([])
  const [p2,setP2]=useState([])
  const [p3,setP3]=useState([])
  const [sliderValue, setSliderValue] = useState(0);
  const [floorPath, setFloorPath] = useState(p1);
  const floorData = ["images/MCA0.png", "images/MCA1.png", "images/MCA2.png"];
  const [currentImage, setCurrentImage] = useState("images/MCA0.png");
  const [floorImg, setFloorImage] = useState(0);


  const src=sessionStorage.getItem("src")
  const dest=sessionStorage.getItem("dest")
  const [data,setData]=useState([])
  const [radius,setRadius]=useState(0)
  const [over,setOver]=useState(0);

  useEffect(() => {
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

      context.drawImage(img, 0, 0, canvas.width * 0.75, canvas.height * 0.75);
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
          setSliderValue(slider*50);
        }
      
    }, 3000);
   
      
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
    if(src[0]!=='C'&&src[1]!=='S'){
      src="CS_start"
    }
    
    try {
      await axios.post('http://127.0.0.1:5000/shortestpath', { 
        src:src,
        dest:dest,
        dept:"cse"
       },{
        headers: {
          'Content-Type': 'application/json'
        }}).then(res=>{
        // console.log(res.data.path);
        var p = splitPath(res.data.path, 3)
        
        // console.log(p.path)
        
        if(p.path[0])
          setP1(Array.from(p.path[0], x => [3.6*x[0], 3.6*x[1]]))
        if(p.path[1])
          setP2(Array.from(p.path[1], x => [3.6*x[0], 3.6*x[1]]))
        if(p.path[2])
          setP3(Array.from(p.path[2], x => [3.6*x[0], 3.6*x[1]]))
        // console.log(p1,p2,p3)
        console.log(p.ids)
       })
      // Handle the response data
      
    } catch (error) {
      // Handle the error
      console.error("CSEerror",error);
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
    slider=val/50;
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

  return (
    <div>
      <div className="mca-main">

        <div className='mca-left text-center'>
          <Link to="/CSE" className='left-nav-links'>
            CSE
          </Link>
          <Link to="/MCA" className='left-nav-links left-active-link'>
            MCA
          </Link>
          <Link to="/MAIN" className='left-nav-links'>
            MECH
          </Link>
          <Link to="/CIVIL" className='left-nav-links'>
            CIVIL
          </Link>
          <Link to="/EEE" className='left-nav-links'>
            EEE
          </Link>
        </div>

        <div className="d-flex justify-content-around w-100">
          <div className="mca-mid">
            <canvas ref={canvasRef} style={{ height: "calc(100vh - 71px)", paddingLeft: "10%", paddingTop: "10%" }} />
          </div>
          <div className="mca-right">
            <Slider

              aria-label="Custom marks"
              defaultValue={0}
              step={50}
              orientation="vertical"
              value={sliderValue}
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
export default Mca;
