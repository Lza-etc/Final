import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, useNavigate } from "react-router-dom";
import "../styles/ShowEvent.css";
import { Box } from "@mui/material";

const ShowEvent = () => {
  const navigate = useNavigate();

  const navigateAbout = () => {
    navigate("/About");
  };
  const navigateAddEvent = () => {
    navigate("/AddEvent");
  };
  const navigateShowEvent = () => {
    navigate("/ShowEvent");
  };
  const navigateOrg = () => {
    navigate("/Org");
  };

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/events");
      setItems(response.data.events);
      // console.log(response.data)
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="se-main">
      <Box className="se-box-main">
        <div className="se-left">
          <div className="left-name">
            <img className="logo-img" src={"https://raw.githubusercontent.com/Lza-etc/imageData/main/ieee-logo.jpg"} />
            <img className="edit-img" src={"https://raw.githubusercontent.com/Lza-etc/imageData/main/edit-icon.png"} />
          </div>
          <div className="left-buttons">
            <button onClick={navigateOrg}> IEEE Organisation </button>
            {/* <button onClick={navigateLoc}> LOCATION </button> */}
            <button onClick={navigateShowEvent}> EVENTS </button>
            <button onClick={navigateAddEvent}> ADD EVENT </button>
            <button onClick={navigateAbout}> ABOUT </button>
          </div>
        </div>
        <div className="se-right">
          <div>
            <h3 className="event-heading">EVENTS</h3>
            <div className="se-right-card">
              {items.map((item) => {
                return (
                  <div
                    style={{
                      backgroundColor: "white",
                      width: "215px",
                      height: "fit-content",
                      marginRight: "15px",
                    }}
                  >
                    <div className="card-image-container">
                      <img
                        src={item.image}
                        style={{ width: "210px", height: "210px" }}
                      />
                    </div>
                    <div className="card-title">{item.title}</div>
                    <div className="card-venue-container">
                      <div className="card-venue">{item.location}</div>
                    </div>
                    <div className="card-date-container">
                      <div className="card-date">{item.datetime.split()[0].replace('GMT','')}</div>
                      {/* <div className="card-date-label">10:30am</div> */}
                    </div>
                    <div className="details-container">
                      {item.description}
                    </div>
                  </div>
                );
              })}

              
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default ShowEvent;
