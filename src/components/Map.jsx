import React, { useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { RulerControl, StylesControl, ZoomControl, CompassControl } from 'mapbox-gl-controls';


export const MapView = () => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiYm9saW9saWFndXN0aW4iLCJhIjoiY2t6eDVzcWY5NDJoNTJucW9xaHY2bXA2dCJ9.ZR3iXpsXSNMjzh9Nj-0EDQ';
  
  const [lng, setLng] = useState(-56.15);
  const [lat, setLat] = useState(-34.87);
  const [zoom, setZoom] = useState(11);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "mapContainer",
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [lng, lat],
      zoom: [zoom],
      pitch: 45
    });

    map.on('move', () => {
        setLng(map.getCenter().lng.toFixed(4));
        setLat(map.getCenter().lat.toFixed(4));
        setZoom(map.getZoom().toFixed(2));
      });


    // Add ruler control
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
  
    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    // Render map
    return (
      <div>
        <div className='sidebar'>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div id="mapContainer" className="map-container"/>
      </div>
    )
}