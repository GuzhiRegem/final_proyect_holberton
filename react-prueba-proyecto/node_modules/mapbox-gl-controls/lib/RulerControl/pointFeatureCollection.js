export default function pointFeatureCollection(coordinates = [], labels = []) {
    return {
        type: 'FeatureCollection',
        features: coordinates.map((c, i) => ({
            type: 'Feature',
            properties: {
                text: labels[i],
            },
            geometry: {
                type: 'Point',
                coordinates: c,
            },
        })),
    };
}
//# sourceMappingURL=pointFeatureCollection.js.map