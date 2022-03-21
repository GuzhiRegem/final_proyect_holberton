import React, { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import '../../style/map.css';
import axios from "axios";
import { Apiurl } from '../../services/apirest';

export function MapBusesView(id) {

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
        style: "mapbox://styles/mapbox/streets-v11",
        center: [lng, lat],
        zoom: zoom,
        pitch: 45,
        maxPitch: 60
      });
      map.addControl(new mapboxgl.FullscreenControl());
      map.on('load', function () {
        axios.get(Apiurl + "/api/buses/get/" + id.id)
          .then(res_bus => {
            axios.get(Apiurl + "/api/routes/data/" + res_bus.data.route)
              .then(res => {
                console.log(res.data);
                map.addSource('bus_route', {
                  type: 'geojson',
                  data: res.data
                });
  
                map.addLayer({
                  id: 'bus_route_line',
                  type: 'line',
                  source: 'bus_route',
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                  },
                  paint: {
                    'line-color': '#4eb068',
                    'line-width': 8
                  },
                  filter: ['==', '$type', 'LineString']
                });
  
                map.addLayer({
                  id: 'bus_route_stops',
                  type: 'circle',
                  source: 'bus_route',
                  paint: {
                    'circle-radius': 10,
                    'circle-color': '#4eb068'
                  },
                  filter: ['==', '$type', 'Point']
                });
                const points = []
                for (let i = 1; res.data.features[0].geometry.coordinates[i]; i++) {
                  points.push(res.data.features[0].geometry.coordinates[i]);
                }
                var bounds = points.reduce(function (bounds, coord) {
                  return bounds.extend(coord);
                }, new mapboxgl.LngLatBounds(points[0], points[0]));
                map.fitBounds(bounds, {
                  padding: 50,
                  duration: 0
                });
              });
            document.querySelector('.mapboxgl-canvas').style.opacity = '100%';
            id.on_load();
          });
      });
    };

    if (!map) initializeMap({ setMap, mapContainer, lat, lng, zoom });
  }, [map, mapContainer, lat, lng, zoom]);
  return <div ref={el => (mapContainer.current = el)} className="mapContainer" />;
};


