const domain = 'localhost';
let isStopFollowing = false;
function toggleStopFollow () {
  isStopFollowing = !isStopFollowing;
}
let isFollowing = false;
function toggleFollow () {
  isFollowing = !isFollowing;
}
let isFullScreenOn = false;
function toggleFullScreen () {
  isFullScreenOn = !isFullScreenOn;
  if (isFullScreenOn) {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
  }
}
const popupList = [];

const map = new maplibregl.Map({
  container: 'map', // container id
  style: 'http://' + domain + ':8080/styles/osm-bright/style.json', // style URL
  center: [-56.073358, -34.791454],
  zoom: 0.0,
  minPitch: 40,
  maxPitch: 40,
  pitch: 40,
  bearing: 0.5,
  maxZoom: 18.0
});

function boundTo(points, duration) {
  var bounds = points.reduce(function (bounds, coord) {
    return bounds.extend(coord);
  }, new maplibregl.LngLatBounds(points[0], points[0]));
  map.fitBounds(bounds, {
    padding: 100,
    duration: duration
  });
}

const busDiv = document.createElement('div');
busDiv.className = 'bus';
busDiv.style.zIndex = 100;
const bus = new maplibregl.Marker(busDiv)
  .setLngLat([-56.073358, -34.791454])
  .addTo(map);

const stopDiv = document.createElement('div');
stopDiv.className = 'stop';
stopDiv.style.zIndex = 100;
const stop = new maplibregl.Marker(stopDiv)
  .setLngLat([-56.073358, -34.791454])
  .addTo(map);

let stopLoc = [0, 0];
let busLoc = [0, 0];
const updateSource = setInterval(async () => {
  const geojson = await getLocation();
  busLoc = geojson.position;
  stopLoc = geojson.next_stop;
}, 100);

const FrameLoop = setInterval(function () {
  for (let i = 0; popupList[i]; i++) {
    const popup = popupList[i].getElement();
    const yIndex = popup.style.webkitTransform.slice(32, -29).split(', ')[1].slice(0, -2);
    popupList[i].popup.getElement().style.zIndex = yIndex;
  }
  const act = bus.getLngLat();
  const out = [(busLoc[0] - act.lng) / 10, (busLoc[1] - act.lat) / 10];
  bus.setLngLat([act.lng + out[0], act.lat + out[1]]);
  stop.setLngLat([stopLoc[0], stopLoc[1]]);
}, 20);

const CameraLoop = setInterval(function () {
  if (
    !map.dragRotate.isActive() &&
    !map.dragPan.isActive() &&
    !map.touchZoomRotate.isActive() &&
    isFollowing
  ) {
    const pos = [bus.getLngLat().lng, bus.getLngLat().lat];
    if (isStopFollowing) {
      boundTo([busLoc, stopLoc], 1000);
    } else {
      const diff = 0.001
      boundTo([
        [pos[0] - diff, pos[1] - diff],
        [pos[0] +diff, pos[1] + diff]
      ], 1000);
    }
  }
}, 100);

async function getLocation () {
  const response = await fetch('http://' + domain + ':5001/state/');
  const out = await response.json();
  return out;
}

async function addRoute (map) {
  const response = await fetch('http://' + domain + ':5001/route/');
  const out = await response.json();
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
      'line-color': '#B42222',
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
      'circle-color': '#B42222'
    },
    filter: ['==', '$type', 'Point']
  });

  const lis = out.features[0].geometry.coordinates;
  boundTo(lis, 4000);
}

function showPoints(points) {
  popupList.length = 0;
  for (let i = 0; points[i]; i++) {
    const popup = new maplibregl.Popup({
      offset: 10,
      closeButton: false,
      closeOnClick: false
    })
      .setHTML(points[i].content)
      .setLngLat(points[i].position.coordinates)
      .addTo(map);
    popup.isVisible = false;
    popup.getElement().style.opacity = '0%';
    popup.getElement().style.transition = 'opacity 0.5s ease';
    const markDiv = document.createElement('div');
    markDiv.className = 'marker';
    const marker = new maplibregl.Marker(markDiv)
      .setLngLat(points[i].position.coordinates)
      .addTo(map);
    marker.popup = popup;
    marker.getElement().addEventListener('click', function () {
      marker.popup.isVisible = !marker.popup.isVisible;
      if (marker.popup.isVisible) {
        marker.popup.getElement().style.pointerEvents = 'auto';
        marker.popup.getElement().style.opacity = '100%';
      } else {
        marker.popup.getElement().style.pointerEvents = 'none';
        marker.popup.getElement().style.opacity = '0%';
      }
    });
    popupList.push(marker);
  }
}

async function getPoints() {
  const response = await fetch('http://' + domain + ':5001/points/');
  const out = await response.json();
  console.log(out);
  showPoints(out);
}

map.on('load', () => {
  addRoute(map);
  busLoc = getLocation().position;
  getPoints()
  document.querySelector('#map').style.opacity = "100%";
});
