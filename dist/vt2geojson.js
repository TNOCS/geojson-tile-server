"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extent = 4096;
var GeometryType;
(function (GeometryType) {
    GeometryType[GeometryType["Unknown"] = 0] = "Unknown";
    GeometryType[GeometryType["Point"] = 1] = "Point";
    GeometryType[GeometryType["LineString"] = 2] = "LineString";
    GeometryType[GeometryType["Polygon"] = 3] = "Polygon";
})(GeometryType || (GeometryType = {}));
;
exports.toFeatureCollection = function (features, x, y, z) {
    return {
        type: 'FeatureCollection',
        features: features.map(function (f) { return toGeoJSON(f, x, y, z); })
    };
};
var toGeoJSON = function (feature, x, y, z) {
    var size = extent * Math.pow(2, z);
    var x0 = extent * x;
    var y0 = extent * y;
    var coords = feature.geometry;
    var type = GeometryType[feature.type];
    // let type = feature.type;
    // let i, j;
    var project = function (line) {
        for (var j = 0; j < line.length; j++) {
            var p = line[j];
            var y2 = 180 - (p[1] + y0) * 360 / size;
            line[j] = [
                (p[0] + x0) * 360 / size - 180,
                360 / Math.PI * Math.atan(Math.exp(y2 * Math.PI / 180)) - 90
            ];
        }
    };
    switch (feature.type) {
        case GeometryType.Point:
            project(coords);
            break;
        case GeometryType.LineString:
            type = 'LineString';
            for (var i = 0; i < coords.length; i++) {
                project(coords[i]);
            }
            break;
        case GeometryType.Polygon:
            type = 'Polygon';
            coords = classifyRings(coords);
            for (var i = 0; i < coords.length; i++) {
                for (var j = 0; j < coords[i].length; j++) {
                    project(coords[i][j]);
                }
            }
            break;
    }
    if (coords.length === 1) {
        coords = coords[0];
    }
    else {
        type = 'Multi' + type;
    }
    var result = {
        type: 'Feature',
        geometry: {
            type: type,
            coordinates: coords
        },
        properties: feature.tags
    };
    return result;
};
// classifies an array of rings into polygons with outer rings and holes
var classifyRings = function (rings) {
    var len = rings.length;
    if (len <= 1)
        return [rings];
    var polygons = [];
    var polygon = [];
    var ccw;
    for (var i = 0; i < len; i++) {
        var area = signedArea(rings[i]);
        if (area === 0)
            continue;
        if (ccw === undefined)
            ccw = area < 0;
        if (ccw === area < 0) {
            if (polygon)
                polygons.push(polygon);
            polygon = [rings[i]];
        }
        else {
            polygon.push(rings[i]);
        }
    }
    if (polygon)
        polygons.push(polygon);
    return polygons;
};
var signedArea = function (ring) {
    var sum = 0;
    for (var i = 0, len = ring.length, j = len - 1, p1 = void 0, p2 = void 0; i < len; j = i++) {
        p1 = ring[i];
        p2 = ring[j];
        sum += (p2[0] - p1[0]) * (p1[1] + p2[1]);
    }
    return sum;
};
//# sourceMappingURL=vt2geojson.js.map