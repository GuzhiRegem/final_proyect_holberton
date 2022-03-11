function readFiles(map) {
    const fs = require('fs');

    const dir_routes = './features/routes/';
    let routes = [];
    const dir_popups = './features/popups/';
    let popups = [];
    const dir_zones = './features/zones/';
    let zones = [];

    fs.readdirSync(dir_routes).forEach(file => {
        const content = fs.readFileSync(dir_routes + file, {encoding:'utf8', flag:'r'});
        const obj = JSON.parse(content);
        map.addSource('route',{
            'type': 'geojson',
            'data': obj.geojson
        })
        obj.update = function() {};
        routes.push(obj)
    });

    fs.readdirSync(dir_popups).forEach(file => {
        const content = fs.readFileSync(dir_popups + file, {encoding:'utf8', flag:'r'});
        const obj = JSON.parse(content);
        map.addSource('route',{
            'type': 'geojson',
            'data': obj.geojson
        })
        obj.update = function() {};
        routes.push(obj)
    });

    return routes;
}

console.log(readFiles(undefined));
