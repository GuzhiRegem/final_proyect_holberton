const domain = '192.168.122.1';
let colorObj = {
  list: [
    '#FF5964',
    '#1E2EDE',
    '#DDB771',
    '#04F06A',
    '#E0479E',
    '#DE3C4B',
    '#87F5FB',
    '#30C5FF'
  ],
  idx: 0
};
let isStopFollowing = false;
function toggleStopFollow() {
  isStopFollowing = !isStopFollowing;
}
let isFollowing = false;
function toggleFollow() {
  isFollowing = !isFollowing;
  if (isFollowing) {
    cameraObj.position = [map.getCenter().lng, map.getCenter().lat];
    cameraObj.zoom = map.getZoom();
    cameraObj.bearing = map.getBearing();
  }
}
let isFullScreenOn = false;
function toggleFullScreen() {
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
  minPitch: 60,
  maxPitch: 60,
  pitch: 60,
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
bus.objective = [-56.073358, -34.791454];
bus.actual = [-56.073358, -34.791454];


const stopDiv = document.createElement('div');
stopDiv.className = 'stop';
stopDiv.style.zIndex = 100;
const stop = new maplibregl.Marker(stopDiv)
  .setLngLat([-56.073358, -34.791454])
  .addTo(map);
  
let route_id = "";
const updateSource = setInterval(async () => {
  const geojson = await getLocation();
  if (geojson.route_id !== route_id) {
    const tmp = await addRoute(map);
    route_id = geojson.route_id;
  }
  bus.objective = geojson.position;
  stop.setLngLat(geojson.next_stop);
  stop.position = [stop.getLngLat[0], stop.getLngLat[1]];
  getPoints();
  cameraObj.bearingObjective = (Math.abs(geojson.direction));
}, 2000);

let time = 0;
const FrameLoop = setInterval(function () {
  time += 20;
  for (let i = 0; popupList[i]; i++) {
    const popup = popupList[i].getElement();
    const yIndex = popup.style.webkitTransform.slice(32, -29).split(', ')[1].slice(0, -2);
    popupList[i].popup.getElement().style.zIndex = yIndex;
  }
  const out = [(bus.objective[0] - bus.actual[0]) / 10, (bus.objective[1] - bus.actual[1]) / 10];
  bus.setLngLat([bus.actual[0] + out[0], bus.actual[1] + out[1]]);
  bus.actual = [bus.getLngLat().lng, bus.getLngLat().lat];
}, 20);

const cameraObj = {
  position: [0, 0],
  zoom: 0,
  bearing: 0,
  bearingObjective: 14,
  zoomObjective: 17
}
cameraObj.update = function () {
  if (
    !map.dragRotate.isActive() &&
    !map.dragPan.isActive() &&
    !map.touchZoomRotate.isActive() &&
    isFollowing
  ) {
    if (isStopFollowing) {
      boundTo([bus.objective, [stop.getLngLat().lng, stop.getLngLat().lat]], 1000);
    } else {
      cameraObj.zoom += (cameraObj.zoomObjective - cameraObj.zoom);
      let objective = bus.actual;
      if (exploreObj.actual) {
        const pos = [exploreObj.actual.getLngLat().lng, exploreObj.actual.getLngLat().lat];
        const diff = [(pos[0] - objective[0]) * 0.5, (pos[1] - objective[1]) * 0.5];
        objective = [objective[0] + diff[0], objective[1] + diff[1]];
      }
      const diff = [(objective[0] - cameraObj.position[0]), (objective[1] - cameraObj.position[1])];
      cameraObj.position = [cameraObj.position[0] + diff[0], cameraObj.position[1] + diff[1]];
      cameraObj.bearing = cameraObj.bearingObjective;
      console.log(cameraObj.padding);
      map.easeTo({
        center: cameraObj.position,
        zoom: cameraObj.zoom,
        bearing: cameraObj.bearing,
        padding: cameraObj.padding,
        duration: 2000
      });
    }
  }
};
const CameraLoop = setInterval(cameraObj.update, 2000);

const exploreObj = {
  idx: 0,
  actual: undefined
};
exploreObj.update = function () {
  if (!isFollowing) { return; }
  if (exploreObj.actual) {
    exploreObj.idx++;
    if (exploreObj.idx >= popupList.length) { exploreObj.idx = 0; }
  } else {
    exploreObj.idx = 0;
  }
  exploreObj.actual = popupList[exploreObj.idx];
  if (exploreObj.actual) {
    if (!exploreObj.actual.popup.isVisible) {
      exploreObj.actual.clickF();
      cameraObj.update();
    }
  }
};
const exploreLoop = setInterval(exploreObj.update, 3000);

async function getLocation() {
  const response = await fetch('http://' + domain + ':5001/state/');
  const out = await response.json();
  return out;
}

async function addRoute(map) {
  const response = await fetch('http://' + domain + ':5001/route/');
  const out = await response.json();
  try {
    map.removeLayer('bus_route_stops');
  } catch (error) {
    console.log(error);
  }
  try {
    map.removeLayer('bus_route_line');
  } catch (error) {
    console.log(error);
  }
  try {
    map.removeSource('bus_route');
  } catch (error) {
    console.log(error);
  }
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

  const lis = out.features[0].geometry.coordinates;
  boundTo(lis, 4000);
}

const pointsObj = {
  actual: undefined
}

function showPoints(points) {
  idList = [];
  popIdList = [];
  for (let i = 0; points[i]; i++) { idList.push(points[i]._id); }
  for (let i = 0; popupList[i]; i++) {
    if (!idList.includes(popupList[i]._id)) {
      if (popupList[i] === exploreObj.actual) {
        exploreObj.update();
      }
      popupList[i].destroy();
      popupList.splice(i, 1);
      i--;
    } else {
      popIdList.push(popupList[i]._id);
    }
  }
  for (let i = 0; points[i]; i++) {
    if (popIdList.includes(points[i]._id)) { continue }
    const popup = new maplibregl.Popup({
      offset: 10,
      closeButton: false,
      closeOnClick: false
    })
      .setHTML('?')
      .setLngLat(points[i].position.coordinates)
      .addTo(map);
    popup.isVisible = false;
    const markDiv = document.createElement('div');
    markDiv.style.opacity = '100%';
    colorObj.idx++;
    if (colorObj.idx >= colorObj.list.length) { colorObj.idx = 0; }
    markDiv.className = 'marker';
    const marker = new maplibregl.Marker(markDiv)
      .setLngLat(points[i].position.coordinates)
      .addTo(map);
    marker.content = points[i].content;
    marker.popup = popup;
    marker.color = colorObj.list[colorObj.idx];
    markDiv.style.backgroundColor = marker.color;
    marker._id = points[i]._id;
    marker.clickF = function () {
      if (pointsObj.actual !== marker) {
        if (pointsObj.actual) {
          if (pointsObj.actual.popup.isVisible) {
            pointsObj.actual.clickF();
          }
        } else {
          pointsObj.actual = undefined;
        }
      }
      pointsObj.actual = marker;
      marker.popup.isVisible = !marker.popup.isVisible;
      const child = marker.popup.getElement().querySelectorAll('*');
      const cont = child[1];
      if (marker.popup.isVisible) {
        marker.popup.getElement().style.pointerEvents = 'auto';
        marker.popup.getElement().style.opacity = '100%';
        cont.style.transform = 'scale(1.0)';
        marker.getElement().style.backgroundColor = 'black';
        marker.getElement().style.opacity = '100%';
      } else {
        marker.popup.getElement().style.pointerEvents = 'none';
        marker.popup.getElement().style.opacity = '0%';
        cont.style.transform = 'scale(0.0)';
        marker.getElement().style.backgroundColor = marker.color;
        marker.getElement().style.opacity = '60%';
        if (pointsObj.actual === marker) {
          pointsObj.actual = undefined;
        }
      }
      console.log(pointsObj.actual);
      if (popupObj) {
        popupObj.update();
      }
    };
    marker.destroy = function () {
      marker.getElement().style.opacity = '0%';
      if (marker.popup.isVisible) { marker.clickF(); }
      setTimeout(function () {
        marker.popup.remove();
        marker.remove();
        if (pointsObj.actual === marker) {
          pointsObj.actual = undefined;
        }
      }, 500);
    };
    marker.getElement().addEventListener('click', marker.clickF);
    popupList.push(marker);
  }
}

async function getPoints() {
  const response = await fetch('http://' + domain + ':5001/points/');
  const out = await response.json();
  showPoints(out);
}


map.on('load', () => {
  map.removeLayer('poi-level-1');
  map.removeLayer('poi-level-2');
  map.removeLayer('poi-level-3');
  popupObj.setSize();
  bus.objective = getLocation().position;
  getPoints();
  document.querySelector('#map').style.opacity = "100%";
});
