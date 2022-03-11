mapboxgl.accessToken = 'pk.eyJ1IjoiZ3V6aGlyZWdlbSIsImEiOiJja3hycnFoZnE0cHBlMnVwejN2aTZtMno3In0.q7H3RpvB5PPOiKCGSoSJQg';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/guzhiregem/ckxrwdncp34fa14sxma65x0mj'
});
const mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0];
const mapDiv = document.getElementById('map');
mapDiv.style.width = '100%';
mapCanvas.style.width = '100%';
mapDiv.style.height = innerHeight;
mapCanvas.style.height = '100%';
map.resize();
//let features = readFiles(map);
let data = {
    x: -56.073358,
    y: -34.791454,
    zoom: 0.0,
    angle: 0.0,
    hor: 0.0,
    time: 0
}

function gameLoop() {
    mapDiv.style.width = '100%';
    mapDiv.style.height = innerHeight;
    map.resize();
    data.time += 0.001;
    data.angle = data.time * 200;
    data.zoom = ((Math.sin(data.time * 5) + 1) * 4) + 6;
    data.hor = ((Math.sin(data.time * 5) + 1) * 35);
    console.log(data.zoom)
    map.jumpTo({
        center: [data.x, data.y],
        zoom: data.zoom,
        bearing: + data.angle,
        pitch: data.hor
    })
//    for (let i = 0; features[i]; i++) {
//        features[i].update(data)
//    }
    window.requestAnimationFrame(gameLoop);
}

map.on('load', () => {
    window.requestAnimationFrame(gameLoop);
});
