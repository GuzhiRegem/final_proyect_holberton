import React, { useEffect, useRef, useState } from "react";
import "../style/map.css"
import mapboxgl from 'mapbox-gl'
import mapboxGlDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

const styles = {
    width: "100vw",
    height: "calc(100vh - 80px)",
    position: "absolute"
  };  

export  function MapRouteView() {
      
    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);
    const [lng, setLng] = useState(-56.073358);
    const [lat, setLat] = useState(-34.791454);
    const [zoom, setZoom] = useState(11);
    
    useEffect(() => {
        mapboxgl.accessToken = "pk.eyJ1IjoiYm9saW9saWFndXN0aW4iLCJhIjoiY2t6eDVzcWY5NDJoNTJucW9xaHY2bXA2dCJ9.ZR3iXpsXSNMjzh9Nj-0EDQ"
        const initializeMap = ({ setMap, mapContainer }) => {
            const map = new mapboxgl.Map({
              container: mapContainer.current,
              style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
              center: [lng, lat],
              zoom: zoom,
              pitch: 45
            });
    
        const draw = new mapboxGlDraw({
            displayControlsDefault: false,
            controls: {
                line_string: true,
                polygon: true,
                trash: true
            }
        });
        map.addControl(draw);
        
        map.on('draw.create', (e) => {
            console.log(e.features);
        });

    };

    if (!map) initializeMap({ setMap, mapContainer, lat, lng, zoom });
            }, [map, mapContainer, lat, lng, zoom]);
        
            return <div ref={el => (mapContainer.current = el)} style={styles} />;
            };


