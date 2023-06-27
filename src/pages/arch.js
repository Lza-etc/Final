import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/dept.css";
import axios from "axios";
import { Slider } from "@mui/material";
import splitPath from "./path_split.js";
import { plotPath } from "../components/PlotPath";
import { DrawCircle } from "../components/DrawCircle";


var spath = 1;
var x = 0, y = 0;
var slider = 0;
const loc = sessionStorage.getItem("loc")
if (loc) {
  if (loc[4] === '1') {
    slider = 0;
  }
  else if (loc[4] === '2') {
    slider = 1
  }
  else if (loc[4] === '3') {
    slider = 2;
  }
}
else {
  slider = 0;
}

function Arch() {
  const canvasRef = useRef(null);

  
  const [p1,setP1]=useState([])
  const [p2,setP2]=useState([])
  const [p3,setP3]=useState([])
  const [p0,setP0]=useState([])
  const [sliderValue, setSliderValue] = useState(0);
  const [floorPath, setFloorPath] = useState(p1);
  const floorData = ["https://raw.githubusercontent.com/Lza-etc/imageData/main/arch_b2.png", "https://raw.githubusercontent.com/Lza-etc/imageData/main/arch_basement1.png", "https://raw.githubusercontent.com/Lza-etc/imageData/main/Arch_ground.png", "https://raw.githubusercontent.com/Lza-etc/imageData/main/arch_1.png"];
  const [currentImage, setCurrentImage] = useState("https://raw.githubusercontent.com/Lza-etc/imageData/main/arch_b2.png");
  const [floorImg, setFloorImage] = useState(0);


  const src=sessionStorage.getItem("src")
  const dest=sessionStorage.getItem("dest")
  const dept=sessionStorage.getItem("dept")
  const cancel = sessionStorage.getItem("cancel")
  const [data,setData]=useState([])

  useEffect(() => {
    console.log("useEffect");
    spath=sessionStorage.getItem("spath");
    // setLoc(sessionStorage.getItem("loc"));
    if (dept !== "arch") {
      sessionStorage.setItem("dept", "arch");
    }
    if (cancel) {
      setP1([])
      setP2([])
      setP3([])
      setP0([])
      // p1Ref.current = [];
      // p2Ref.current = [];
      // p3Ref.current = [];
      setFloorPath([])
      setFloorImage(0)
      slider = 0
      // setFloorImage(slider);
      // setCurrentImage(floorData[slider]);
      // setSliderValue(slider * 50);
      sessionStorage.removeItem("cancel");
    }

    executeCode()


    const handleRefresh = (event) => {
      sessionStorage.removeItem("loc");
      sessionStorage.removeItem("src");
      sessionStorage.removeItem("dest");
      slider=0
      // setFloorImage(slider);
      // setCurrentImage(floorData[slider]);
      // setSliderValue(slider * 50);
    };
    window.addEventListener('beforeunload', handleRefresh);

    return () => {
      window.removeEventListener('beforeunload', handleRefresh);
    };

  }, [currentImage,p1,p2,p3]);

  const executeCode = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    var z = 0;
    // console.log("useEffects")
    if (loc)
      setRadius(30)

    const img = new Image();
    img.src = currentImage;
    context.clearRect(0, 0, canvas.width, canvas.height);


    fetchData();
    imageLoad(canvas, context, img)
    plotPath(context, floorPath);
  }

  const fetchData = async () => {

    if (!data) {

      await axios.get("http://127.0.0.1:5000/floors/arch").then(res=>{
        console.log(res)
        setData(res);
    })
        .catch(error => {
          console.error('Error:', error);
        });
    }

    if (src && dest && spath) {
      spath = 0;
      shortestPath(src, dest).then(res => {
        console.log("shortest path complete")
        // slider=sz
        // // console.log("slider")
        // setFloorImage(slider);
        // setCurrentImage(floorData[slider]);
        // setSliderValue(slider * 50);

      })
    }
    else if (loc) {

      setTimeout(() => {
        console.log("loc" + loc)
        if (data && loc)
          data.map((building) => {
            const regex = /[^a-z0-9]+/gi;

            const b = building["ID"].replace(regex, "");
            const c = loc.replace(regex, "");
            // console.log(b,c)
            if (
              c.toLowerCase() ===
              b.toLowerCase()
            ) {
              console.log("got it")
              x = building.fx;
              y = building.fy;
              z = building.z;
              return;
            }
            return 0;
          })
      }, 1000);
    }
  };

  const imageLoad = (canvas, context, img) => {
    // console.log("image load")
    img.onload = () => {
      // console.log("image load inside")
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      context.lineWidth = 20;
      context.strokeStyle = "red";

      setTimeout(() => {
        // Draw the circle
        DrawCircle(context);

        if (slider !== floorImg) {
          setFloorImage(slider);
          setCurrentImage(floorData[slider]);
          setSliderValue(slider * 33);
        }

      }, 3000);

      plotPath(context, floorPath);
    }
  }

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
        dept:"arch"
       },{
        headers: {
          'Content-Type': 'application/json'
        }}).then(res=>{
        // console.log(res.data.path);
        var p = splitPath(res.data.path, 4)
        
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
      console.error("Archerror",error);
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
    <div className="dept-main">
      <div className="dept-left text-center">
          <Link to="/CSE" className='left-nav-links'>
          CSE
          </Link>
          <Link to="/MCA" className='left-nav-links '>
          MCA
          </Link>
          <Link to="/CIVIL" className='left-nav-links'>
          CIVIL
          </Link>
          <Link to="/CIVIL2" className='left-nav-links'>
          CIVIL-II
          </Link>
          <Link to="/Arch" className='left-nav-links'>
          ARCHIE
          </Link>
          <Link to="/MAIN" className='left-nav-links'>
          MECH
          </Link>
          <Link to="/MAIN2" className='left-nav-links'>
          MECH-II
          </Link>
          <Link to="/EEE" className='left-nav-links'>
          EEE
          </Link>
          <Link to="/EC" className="left-nav-links">
          EC
          </Link>
          <Link to="/EC2" className='left-nav-links'>
          EC-II
          </Link>
      </div>
      <div className="dept-mid">
        <canvas ref={canvasRef}/>
      </div>
      <div className="dept-right">
        <Slider
          aria-label="Custom marks"
          defaultValue={0}
          step={33}
          max={99}
          orientation="vertical"
          value={sliderValue}
          valueLabelDisplay="off"
          marks={marks}
          onChange={handleImageChange}
        />
      </div>
      <div className="dept-path">

      </div>
    </div>
);
}
export default Arch;


