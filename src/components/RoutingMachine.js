import { MapLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "lrm-google";
import { withLeaflet } from "react-leaflet";

class Routing extends MapLayer {
  createLeafletElement() {
    const map = this.props.map;
    const startLoc = this.props.startLoc;
    const endLoc = this.props.endLoc;
    console.log(startLoc)
    // let leafletElement = L.Routing.control({
    //   waypoints: [
    //     L.latLng(startLoc[0], startLoc[1]),
    //     L.latLng(endLoc[0], endLoc[1])
    //   ],
    //   lineOptions: {
    //     styles: [
    //       {
    //         color: "blue",
    //         opacity: 0.6,
    //         weight: 4
    //       }
    //     ]
    //   },
    //   router: L.Routing.osrmv1({ 
    //     serviceUrl: 'https://router.project-osrm.org/route/v1',
    //     profile: 'foot'
    //   }),
    //   draggableWaypoints: true,
    //   fitSelectedRoutes: true,
    //   showAlternatives: false,
    //   reverseWaypoints: true 
    // }).addTo(map.leafletElement);

    let leafletElement = L.Routing.control({
      waypoints: [
                L.latLng(startLoc[0], startLoc[1]),
                L.latLng(endLoc[0], endLoc[1])
      ],
      lineOptions: {
        styles: [
          {
            color: "blue",
            opacity: 0.6,
            weight: 4
          }
        ]
      },
      router: L.Routing.osrmv1({ 
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'foot'
      }),
      draggableWaypoints: true,
      fitSelectedRoutes: true,
      showAlternatives: false
    }).addTo(map.leafletElement);
    
    // Swap the waypoints to show the route without considering the direction
    leafletElement.getPlan().setWaypoints([    
    
        L.latLng(endLoc[0], endLoc[1]),
          L.latLng(startLoc[0], startLoc[1])
  ]);
    leafletElement.route();

    return leafletElement.getPlan();
  }
}
export default withLeaflet(Routing);
