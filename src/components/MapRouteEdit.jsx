import React, { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import '../style/map.css'
import axios from "axios";
import { Apiurl } from '../services/apirest';
import mapboxGlDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

export function MapRouteEdit(props) {

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
        maxPitch: 60
      });
      map.addControl(new mapboxgl.FullscreenControl());
      map.on('load', function () {
        map.removeLayer('poi-label');
        let url = Apiurl + "/api/stops"
        axios.get(url)
          .then(res => {
            const out = {
              "type": "FeatureCollection",
              "features": []
            }
            for (let i = 0; i < res.data.length; i++) {
              out.features.push({
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": res.data[i].position.coordinates
                },
                "properties": {}
              })
            }
            map.addSource('bus_route', {
              type: 'geojson',
              data: out
            });

            map.addLayer({
              id: 'bus_route_stops',
              type: 'circle',
              source: 'bus_route',
              paint: {
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  12, 0,
                  18, 16
                ],
                'circle-color': '#525C76',
                'circle-opacity': 0.5,
                'circle-pitch-alignment': 'map'
              },
              filter: ['==', '$type', 'Point']
            });
          });
        const draw = new mapboxGlDraw({
          displayControlsDefault: false,
          styles: [
            {
              'id': 'lines',
              'type': 'line',
              'filter': ['all',
                ['==', '$type', 'LineString'],
                ['==', 'meta', 'feature'],
                ['==', 'active', 'false']],
              'paint': {
                'line-color': '#4eb068',
                'line-width': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  12, 5,
                  18, 16
                ]
              }
            },
            {
              'id': 'lines-selected',
              'type': 'line',
              'filter': ['all',
                ['==', '$type', 'LineString'],
                ['==', 'meta', 'feature'],
                ['==', 'active', 'true']],
              'paint': {
                'line-color': '#4eb068',
                'line-width': 5
              }
            },
            {
              'id': 'points-line',
              'type': 'circle',
              'filter': ['all',
                ['==', '$type', 'Point'],
                ['==', 'meta', 'vertex']],
              'paint': {
                'circle-radius': 5,
                'circle-color': '#000088'
              }
            },
            {
              'id': 'points-line-mid',
              'type': 'circle',
              'filter': ['all',
                ['==', '$type', 'Point'],
                ['==', 'meta', 'midpoint']],
              'paint': {
                'circle-radius': 5,
                'circle-color': '#008888'
              }
            }
          ]
        });
        map.addControl(draw);
        url = Apiurl + "/api/routes/data/" + props.id
        axios.get(url)
          .then(res => {
            const out = res.data
            draw.add(out);
          })
        map.on('draw.update', function (e) {
          let data = draw.getAll().features[0];
          props.updateFunction(data);
        });
      });
    };

    if (!map) initializeMap({ setMap, mapContainer, lat, lng, zoom });
  }, [map, mapContainer, lat, lng, zoom]);
  return <div ref={el => (mapContainer.current = el)} className="mapContainer" />;
};


