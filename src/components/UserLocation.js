import React from "react";
import { useGeolocated } from "react-geolocated";
import Alert from 'react-bootstrap/Alert';

const UserLocation = () => {
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

    return !isGeolocationAvailable ? (
        <div>Your browser does not support Geolocation</div>
    ) : !isGeolocationEnabled ? (
        <div>Geolocation is not enabled</div>
    ) : coords ? (
        {
			
		}
    ) : (
        <div></div>
    );
};

export default UserLocation;