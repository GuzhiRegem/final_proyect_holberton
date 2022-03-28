import React, { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import '../../style/map.css'
import axios from "axios";
import { Apiurl } from '../../services/apirest';
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
                "properties": {
                  "_id": res.data[i]._id,
                  "state": "off",
                  "idx": undefined
                }
              })
            }
            if (stop_list) {
              for (let i = 0; i < stop_list.length; i++) {
                for (let j = 0; j < out.features.length; j++) {
                  if (out.features[j].properties._id == stop_list[i]) {
                    out.features[j].properties.state = "on"
                    out.features[j].properties.idx = i
                  }
                }
              }
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
                'circle-color': '#909090',
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  12, 0,
                  18, 12
                ],
                "circle-opacity": 0.7,
                "circle-pitch-alignment": "map"
              },
              filter: ["all", ['==', '$type', 'Point'], ['==', 'state', 'off']]
            });
            map.addLayer({
              id: 'bus_route_stops_on',
              type: 'circle',
              source: 'bus_route',
              paint: {
                'circle-color': '#000000',
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  12, 3,
                  18, 12
                ],
                "circle-opacity": 1.0,
                "circle-pitch-alignment": "map"
              },
              filter: ["all", ['==', '$type', 'Point'], ['==', 'state', 'on']]
            });

            map.addLayer({
              id: 'bus_route_stops_order',
              type: 'symbol',
              source: 'bus_route',
              layout: {
                "text-field": "{idx}",
                "text-anchor": "bottom",
                "text-offset": [0, -0.5],
                "text-allow-overlap": true,
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
                ['==', 'meta', 'feature']],
              'paint': {
                'line-color': '#4eb068',
                'line-width': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  12, 2,
                  18, 12
                ]
              }
            },
            {
              'id': 'points-line',
              'type': 'circle',
              'filter': ['all',
                ['==', '$type', 'Point'],
                ['==', 'meta', 'vertex']],
              'paint': {
                'circle-radius': {
                  'base': 1.75,
                  'stops': [
                    [10, 5],
                    [16, 10]
                  ]
                },
                'circle-color': '#F56960'
              }
            },
            {
              'id': 'points-line-mid',
              'type': 'circle',
              'filter': ['all',
                ['==', '$type', 'Point'],
                ['==', 'meta', 'midpoint']],
              'paint': {
                'circle-radius': {
                  'base': 1.75,
                  'stops': [
                    [10, 5],
                    [16, 8]
                  ]
                },
                'circle-color': '#C46D5E'
              }
            }
          ]
        });
        map.addControl(draw);
		map.on('draw.modechange', (e) => {
			if (draw.getMode() !== 'direct_select') {
				draw.changeMode('direct_select', {featureId: draw.getAll().features[0].id});
			}
		});
        const stop_list = [];
        url = Apiurl + "/api/routes/data/" + props.id
        axios.get(url)
          .then(res => {
            const out = res.data
            draw.add(out);
            const points = []
            for (let i = 0; out.features[0].geometry.coordinates[i]; i++) {
              points.push(out.features[0].geometry.coordinates[i])
            }
            for (let i = 1; out.features[i]; i++) {
              stop_list.push(out.features[i].properties._id);
            }
            var bounds = points.reduce(function (bounds, coord) {
              return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(points[0], points[0]));
            map.fitBounds(bounds, {
              padding: 50,
              duration: 0
            });
			draw.changeMode('direct_select', {featureId: draw.getAll().features[0].id});
            document.querySelector('.mapboxgl-canvas').style.opacity = '100%';
			props.updateFunction({ route: out.features[0].geometry, stops: stop_list });
            props.on_load();
          })
        map.on('click', 'bus_route_stops', function (e) {
          const coordinates = e.features[0].properties._id;
          let data = map.getSource('bus_route')._data;
          for (let i = 0; data.features[i]; i++) {
            if (data.features[i].properties._id === coordinates) {
              if (data.features[i].properties.state === 'on') {
                data.features[i].properties.state = 'off';
                stop_list.splice(stop_list.indexOf(data.features[i].properties._id), 1);
                data.features[i].properties.idx = undefined;
                for (let j = 0; stop_list[j]; j++) {
                  for (let k = 0; data.features[k]; k++) {
                    if (data.features[k].properties._id === stop_list[j]) {
                      data.features[k].properties.idx = j;
                      data.features[k].properties.state = 'on';
                    }
                  }
                }
              } else {
                data.features[i].properties.state = 'on';
                stop_list.push(data.features[i].properties._id);
                data.features[i].properties.idx = stop_list.length - 1;
              }
            }
          }
          map.getSource('bus_route').setData(data);
          let all_data = draw.getAll().features[0];
          props.updateFunction({
            route: all_data,
            stops: stop_list
          });
        });
        map.on('click', 'bus_route_stops_on', function (e) {
          const coordinates = e.features[0].properties._id;
          let data = map.getSource('bus_route')._data;
          for (let i = 0; data.features[i]; i++) {
            if (data.features[i].properties._id === coordinates) {
              if (data.features[i].properties.state === 'on') {
                data.features[i].properties.state = 'off';
                stop_list.splice(stop_list.indexOf(data.features[i].properties._id), 1);
                data.features[i].properties.idx = undefined;
                for (let j = 0; stop_list[j]; j++) {
                  for (let k = 0; data.features[k]; k++) {
                    if (data.features[k].properties._id === stop_list[j]) {
                      data.features[k].properties.idx = j;
                      data.features[k].properties.state = 'on';
                    }
                  }
                }
              } else {
                data.features[i].properties.state = 'on';
                stop_list.push(data.features[i].properties._id);
                data.features[i].properties.idx = stop_list.length - 1;
              }
            }
          }
          map.getSource('bus_route').setData(data);
          let all_data = draw.getAll().features[0];
          props.updateFunction({
            route: all_data,
            stops: stop_list
          });
        });


        map.on('draw.update', function (e) {
          let data = draw.getAll().features[0];
          props.updateFunction({ route: data, stops: stop_list });
        });
      });
    };

    if (!map) initializeMap({ setMap, mapContainer, lat, lng, zoom });
  }, [map, mapContainer, lat, lng, zoom]);
  return <div ref={el => (mapContainer.current = el)} className="mapContainer" />;
};


