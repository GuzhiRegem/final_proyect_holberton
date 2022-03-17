import React, { useEffect, useRef, useState } from "react";
import "../style/map.css"
import mapboxgl from 'mapbox-gl'

const styles = {
    width: "100vw",
    height: "calc(100vh - 80px)",
    position: "absolute"
  };

export  function MapboxGLMap() {
    
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
              style: "mapbox://styles/guzhiregem/cl0r0cx8q001314lf04oe0pxs", // stylesheet location
              center: [lng, lat],
              zoom: zoom,
              pitch: 45
            });
            
            map.on("load", () => {
                setMap(map);
                map.resize();
              });

                map.on("move", () => {
                    setLng(map.getCenter().lng.toFixed(4));
                    setLat(map.getCenter().lat.toFixed(4));
                    setZoom(map.getZoom().toFixed(2));
                  }
                );
                map.addControl(new mapboxgl.FullscreenControl());
                  console.log(map);
                //Add ruler control
                /*
                map.addControl(new RulerControl(), 'bottom-right');
                map.on('ruler.on', () => console.log('%cruler.on', 'color: #3D5AFE'));
                map.on('ruler.off', () => console.log('%cruler.off', 'color: #3D5AFE'));

                          // with custom styles:
                map.addControl(new StylesControl({
                    styles: [
                    {
                        label: 'Streets',
                        styleName: 'Mapbox Streets',
                        styleUrl: 'mapbox://styles/mapbox/outdoors-v11',
                    }, {
                        label: 'Satellite',
                        styleName: 'Satellite',
                        styleUrl: 'mapbox://styles/mapbox/satellite-v9',
                    },
                    ],
                    onChange: (style) => console.log(style),
                }), 'top-left');
            
                // Add zoom control
                map.addControl(new ZoomControl(), 'bottom-right');
            
                // Add compass control
                map.addControl(new CompassControl(), 'bottom-right');
                */
                    };
                
            if (!map) initializeMap({ setMap, mapContainer, lat, lng, zoom });
          }, [map, mapContainer, lat, lng, zoom]);
    
          return <div ref={el => (mapContainer.current = el)} style={styles} />;
        };