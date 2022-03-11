import { LngLat } from 'mapbox-gl';
import { Cursor, Visibility } from './types';
import { contourLayer, shadowLayer } from './layers';
export default function moveable(map, image, onUpdate) {
    const mapCanvas = map.getCanvas();
    let startPosition = null;
    map.addLayer(Object.assign(Object.assign({}, contourLayer), { source: image.polygonSource.id }));
    map.addLayer(Object.assign(Object.assign({}, shadowLayer), { source: image.polygonSource.id }));
    function onPointerMove(event) {
        const currentPosition = event.lngLat;
        const deltaLng = startPosition.lng - currentPosition.lng;
        const deltaLat = startPosition.lat - currentPosition.lat;
        onUpdate(image.position.map(p => new LngLat(p.lng - deltaLng, p.lat - deltaLat)));
        startPosition = currentPosition;
    }
    function onPointerUp() {
        mapCanvas.style.cursor = Cursor.Move;
        map.off('mousemove', onPointerMove);
        map.setLayoutProperty(contourLayer.id, 'visibility', Visibility.Visible);
    }
    function onPointerDown(event) {
        event.preventDefault();
        startPosition = event.lngLat;
        mapCanvas.style.cursor = Cursor.Grabbing;
        map.on('mousemove', onPointerMove);
        map.setLayoutProperty(contourLayer.id, 'visibility', Visibility.None);
        document.addEventListener('pointerup', onPointerUp, { once: true });
    }
    function onPointerEnter() {
        mapCanvas.style.cursor = Cursor.Move;
    }
    function onPointerLeave() {
        mapCanvas.style.cursor = '';
    }
    map.on('mouseenter', shadowLayer.id, onPointerEnter);
    map.on('mouseleave', shadowLayer.id, onPointerLeave);
    map.on('mousedown', shadowLayer.id, onPointerDown);
    return () => {
        mapCanvas.style.cursor = '';
        map.off('mousemove', onPointerMove);
        map.off('mouseenter', shadowLayer.id, onPointerEnter);
        map.off('mouseleave', shadowLayer.id, onPointerLeave);
        map.off('mousedown', shadowLayer.id, onPointerDown);
        document.removeEventListener('pointerup', onPointerUp);
        if (map.getLayer(shadowLayer.id))
            map.removeLayer(shadowLayer.id);
        if (map.getLayer(contourLayer.id))
            map.removeLayer(contourLayer.id);
    };
}
//# sourceMappingURL=moveable.js.map