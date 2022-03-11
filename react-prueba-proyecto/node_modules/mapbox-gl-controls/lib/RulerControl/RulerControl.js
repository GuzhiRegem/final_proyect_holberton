import mapboxgl from 'mapbox-gl';
import distance from '@turf/distance';
import Base from '../Base/Base';
import Button from '../Button/Button';
import labelFormat from './labelFormat';
import lineStringFeature from './lineStringFeature';
import pointFeatureCollection from './pointFeatureCollection';
import iconRuler from '../icons/ruler';
const LAYER_LINE = 'controls-layer-line';
const LAYER_SYMBOL = 'controls-layer-symbol';
const SOURCE_LINE = 'controls-source-line';
const SOURCE_SYMBOL = 'controls-source-symbol';
const MAIN_COLOR = '#263238';
const HALO_COLOR = '#fff';
export default class RulerControl extends Base {
    constructor(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        super();
        this.isMeasuring = false;
        this.markers = [];
        this.coordinates = [];
        this.labels = [];
        this.units = (_a = options === null || options === void 0 ? void 0 : options.units) !== null && _a !== void 0 ? _a : 'kilometers';
        this.font = (_b = options === null || options === void 0 ? void 0 : options.font) !== null && _b !== void 0 ? _b : ['Roboto Medium'];
        this.fontSize = (_c = options === null || options === void 0 ? void 0 : options.fontSize) !== null && _c !== void 0 ? _c : 12;
        this.fontHalo = (_d = options === null || options === void 0 ? void 0 : options.fontHalo) !== null && _d !== void 0 ? _d : 1;
        this.textVariableAnchor = (options === null || options === void 0 ? void 0 : options.textVariableAnchor) || ['top'];
        this.textAllowOverlap = (options === null || options === void 0 ? void 0 : options.textAllowOverlap) || false;
        this.markerNodeSize = `${(_e = options === null || options === void 0 ? void 0 : options.markerNodeSize) !== null && _e !== void 0 ? _e : 12}px`;
        this.markerNodeBorderWidth = `${(_f = options === null || options === void 0 ? void 0 : options.markerNodeBorderWidth) !== null && _f !== void 0 ? _f : 2}px`;
        this.labelFormat = (_g = options === null || options === void 0 ? void 0 : options.labelFormat) !== null && _g !== void 0 ? _g : labelFormat;
        this.mainColor = (_h = options === null || options === void 0 ? void 0 : options.mainColor) !== null && _h !== void 0 ? _h : MAIN_COLOR;
        this.secondaryColor = (_j = options === null || options === void 0 ? void 0 : options.secondaryColor) !== null && _j !== void 0 ? _j : HALO_COLOR;
        this.button = new Button();
        this.mapClickListener = this.mapClickListener.bind(this);
        this.styleLoadListener = this.styleLoadListener.bind(this);
    }
    insert() {
        this.addClassName('mapbox-control-ruler');
        this.button.setIcon(iconRuler());
        this.button.onClick(() => {
            if (this.isMeasuring) {
                this.measuringOff();
            }
            else {
                this.measuringOn();
            }
        });
        this.addButton(this.button);
    }
    draw() {
        this.map.addSource(SOURCE_LINE, {
            type: 'geojson',
            data: lineStringFeature(this.coordinates),
        });
        this.map.addSource(SOURCE_SYMBOL, {
            type: 'geojson',
            data: pointFeatureCollection(this.coordinates, this.labels),
        });
        this.map.addLayer({
            id: LAYER_LINE,
            type: 'line',
            source: SOURCE_LINE,
            paint: {
                'line-color': this.mainColor,
                'line-width': 2,
            },
        });
        this.map.addLayer({
            id: LAYER_SYMBOL,
            type: 'symbol',
            source: SOURCE_SYMBOL,
            layout: {
                'text-field': '{text}',
                'text-font': this.font,
                'text-anchor': 'top',
                'text-size': this.fontSize,
                'text-offset': [0, 0.8],
            },
            paint: {
                'text-color': this.mainColor,
                'text-halo-color': this.secondaryColor,
                'text-halo-width': this.fontHalo,
            },
        });
    }
    measuringOn() {
        this.isMeasuring = true;
        this.markers = [];
        this.coordinates = [];
        this.labels = [];
        this.map.getCanvas().style.cursor = 'crosshair';
        this.button.addClassName('-active');
        this.draw();
        this.map.on('click', this.mapClickListener);
        this.map.on('style.load', this.styleLoadListener);
        this.map.fire('ruler.on');
    }
    measuringOff() {
        this.isMeasuring = false;
        this.map.getCanvas().style.cursor = '';
        this.button.removeClassName('-active');
        // remove layers, sources and event listeners
        this.map.removeLayer(LAYER_LINE);
        this.map.removeLayer(LAYER_SYMBOL);
        this.map.removeSource(SOURCE_LINE);
        this.map.removeSource(SOURCE_SYMBOL);
        this.markers.forEach(m => m.remove());
        this.map.off('click', this.mapClickListener);
        this.map.off('style.load', this.styleLoadListener);
        this.map.fire('ruler.off');
    }
    mapClickListener(event) {
        const markerNode = this.getMarkerNode();
        const marker = new mapboxgl.Marker({ element: markerNode, draggable: true })
            .setLngLat(event.lngLat)
            .addTo(this.map);
        const newCoordinate = [event.lngLat.lng, event.lngLat.lat];
        this.coordinates.push(newCoordinate);
        this.updateLabels();
        this.updateSource();
        this.markers.push(marker);
        this.map.fire('ruler.change', { coordinates: this.coordinates });
        marker.on('drag', () => {
            const index = this.markers.indexOf(marker);
            const lngLat = marker.getLngLat();
            this.coordinates[index] = [lngLat.lng, lngLat.lat];
            this.updateLabels();
            this.updateSource();
        });
        marker.on('dragend', () => {
            this.map.fire('ruler.change', { coordinates: this.coordinates });
        });
    }
    updateSource() {
        const lineSource = this.map.getSource(SOURCE_LINE);
        const symbolSource = this.map.getSource(SOURCE_SYMBOL);
        lineSource.setData(lineStringFeature(this.coordinates));
        symbolSource.setData(pointFeatureCollection(this.coordinates, this.labels));
    }
    updateLabels() {
        const { coordinates, units, labelFormat } = this;
        let sum = 0;
        this.labels = coordinates.map((coordinate, index) => {
            if (index === 0)
                return labelFormat(0);
            sum += distance(coordinates[index - 1], coordinates[index], { units });
            return labelFormat(sum);
        });
    }
    getMarkerNode() {
        const node = document.createElement('div');
        node.style.width = '12px';
        node.style.height = '12px';
        node.style.borderRadius = '50%';
        node.style.background = this.secondaryColor;
        node.style.boxSizing = 'border-box';
        node.style.border = `2px solid ${this.mainColor}`;
        return node;
    }
    styleLoadListener() {
        this.draw();
    }
    onAddControl() {
        this.insert();
    }
    onRemoveControl() {
        if (this.isMeasuring)
            this.measuringOff();
        this.map.off('click', this.mapClickListener);
    }
}
//# sourceMappingURL=RulerControl.js.map