class IImage {
    loadFile(file) {
        return new Promise(((resolve, reject) => {
            const reader = new FileReader();
            const node = new Image();
            reader.addEventListener('load', () => {
                const imageUrl = reader.result;
                node.onload = () => {
                    this.id = file.name;
                    this.url = imageUrl;
                    this.width = node.width;
                    this.height = node.height;
                    resolve(this);
                };
                node.onerror = reject;
                node.src = imageUrl;
            }, false);
            reader.readAsDataURL(file);
        }));
    }
    loadUrl(url) {
        return new Promise(((resolve, reject) => {
            const node = new Image();
            node.onload = () => {
                this.id = url.split('/').pop();
                this.url = url;
                this.width = node.width;
                this.height = node.height;
                resolve(this);
            };
            node.onerror = reject;
            node.src = url;
        }));
    }
    setInitialPosition(map) {
        if (!this.width || !this.height)
            throw Error('image is not loaded');
        const padding = 20;
        const mapCanvas = map.getCanvas();
        const canvasWidth = mapCanvas.offsetWidth;
        const canvasHeight = mapCanvas.offsetHeight;
        const maxWidth = canvasWidth - padding * 2;
        const maxHeight = canvasHeight - padding * 2;
        const ratio = Math.min(maxWidth / this.width, maxHeight / this.height);
        const resizeWidth = this.width * ratio;
        const resizeHeight = this.height * ratio;
        const result = [
            [canvasWidth / 2 - resizeWidth / 2, canvasHeight / 2 - resizeHeight / 2],
            [canvasWidth / 2 + resizeWidth / 2, canvasHeight / 2 - resizeHeight / 2],
            [canvasWidth / 2 + resizeWidth / 2, canvasHeight / 2 + resizeHeight / 2],
            [canvasWidth / 2 - resizeWidth / 2, canvasHeight / 2 + resizeHeight / 2], // left bottom
        ];
        map.setPitch(0); // reset pitch for correct projection
        this.position = result.map(point => map.unproject(point));
    }
    get coordinates() {
        return this.position.map(p => [p.lng, p.lat]);
    }
    get asPolygon() {
        return {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: { id: this.id },
                    geometry: { type: 'Polygon', coordinates: [[...this.coordinates, this.coordinates[0]]] },
                },
            ],
        };
    }
    get asPoints() {
        return {
            type: 'FeatureCollection',
            features: this.coordinates.map((point, i) => ({
                type: 'Feature',
                properties: { index: i },
                geometry: { type: 'Point', coordinates: point },
            })),
        };
    }
    get imageSource() {
        return {
            id: `${this.id}-raster`,
            source: { type: 'image', url: this.url, coordinates: this.coordinates },
        };
    }
    get polygonSource() {
        return {
            id: `${this.id}-polygon`,
            source: { type: 'geojson', data: this.asPolygon },
        };
    }
    get cornersSource() {
        return {
            id: `${this.id}-corners`,
            source: { type: 'geojson', data: this.asPoints },
        };
    }
    get rasterLayer() {
        return {
            id: `${this.id}-raster`,
            type: 'raster',
            source: this.imageSource.id,
            paint: { 'raster-fade-duration': 0, 'raster-opacity': 0.5 },
        };
    }
    get fillLayer() {
        return ({
            id: `${this.id}-fill`,
            type: 'fill',
            source: this.polygonSource.id,
            paint: { 'fill-opacity': 0 },
        });
    }
    get ratio() {
        return this.width / this.height;
    }
    getOppositePoint(index) {
        if (index === 0)
            return 2;
        if (index === 1)
            return 3;
        if (index === 2)
            return 0;
        if (index === 3)
            return 1;
        throw Error('invalid corner index');
    }
}
export default IImage;
//# sourceMappingURL=IImage.js.map