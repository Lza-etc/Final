import React, { useState } from 'react';
import {Routes, Route, useNavigate, BrowserRouter} from 'react-router-dom';
import EventForm from './Eventform';
import "../styles/Addevent.css";
import { Box } from '@mui/material';


const AddEvent = () => {
    const navigate = useNavigate();

    const navigateAbout = () => {
         navigate('/About');
    };
    const navigateAddEvent = () => {
        navigate('/AddEvent');
    };

    const navigateShowEvent = () => {
        navigate('/ShowEvent');
    };
    const navigateOrg = () => {
        navigate('/Org');
    };
    return (
        // <BrowserRouter>
        <div className="addevent-main">
            <Box className="addevent-box-main">
                <div className="addevent-left">
                    <div className="left-name">
                        <img className="logo-img" src={"https://raw.githubusercontent.com/Lza-etc/imageData/main/ieee-logo.jpg"}/>
                        <img className="edit-img" src={"https://raw.githubusercontent.com/Lza-etc/imageData/main/edit-icon.png"}/>
                    </div>
                    <div className="left-buttons">
                        <button onClick={navigateOrg}> IEEE Organisation </button>
                        {/* <button onClick={navigateLoc}> LOCATION </button> */}
                        <button onClick={navigateShowEvent}> EVENTS </button>
                        <button onClick={navigateAddEvent}> ADD EVENT </button>
                        <button onClick={navigateAbout}> ABOUT </button>
                    </div>
                </div>
                <div className="addevent-right">
                    
                        <div className='addevent-name'>
                            <div className='addevent-name-heading'>
                                <h3>Event Form</h3>
                            </div>
                            <div className='addevent-name-form'>
                                <EventForm />
                            </div>
                        </div>
                </div>
            </Box>
            
        </div>
        // </BrowserRouter>
    )
  };
  
  export default AddEvent;

