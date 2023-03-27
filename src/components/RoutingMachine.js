import { MapLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "lrm-google";
import "lrm-graphhopper"
import { withLeaflet } from "react-leaflet";

class Routing extends MapLayer {
  createLeafletElement() {
    const map = this.props.map;
    const startLoc = this.props.startLoc;
    const endLoc = this.props.endLoc;

    let leafletElement = L.Routing.control({
      waypoints: [
        L.latLng(startLoc[0], startLoc[1]),
        L.latLng(endLoc[0], endLoc[1])
      ],
      // router: new L.Routing.Google(),
      lineOptions: {
        styles: [
          {
            color: "blue",
            opacity: 0.6,
            weight: 4
          }
        ]
      },
      // addWaypoints: false,
      router: new L.Routing.graphHopper('83ca6b35-864a-446a-9261-d95847652111','foot'),
      draggableWaypoints: true,
      fitSelectedRoutes: true,
      showAlternatives: true
    }).addTo(map.leafletElement);

    return leafletElement.getPlan();
  }
}
export default withLeaflet(Routing);
