import React, { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import '../style/map.css'
import axios from "axios";
import { Apiurl } from '../services/apirest';

export function MapRouteView(id) {

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
        pitch: 45,
        maxPitch: 60
      });
      map.addControl(new mapboxgl.FullscreenControl());
      let url = Apiurl + "/api/routes/data/" + id.id
      axios.get(url)
        .then(res => {
          const out = res.data
          map.addSource('bus_route', {
            type: 'geojson',
            data: out
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
          for (let i = 1; i < out.features.length; i++) {
            points.push(out.features[i].geometry.coordinates)
          }
          var bounds = points.reduce(function (bounds, coord) {
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(points[0], points[0]));
          map.fitBounds(bounds, {
            padding: 100,
            duration: 0
          });
        })
    };

    if (!map) initializeMap({ setMap, mapContainer, lat, lng, zoom });
  }, [map, mapContainer, lat, lng, zoom]);
  return <div ref={el => (mapContainer.current = el)} className="mapContainer" />;
};


