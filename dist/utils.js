"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var geojsonvt = require("geojson-vt");
/**
 * Load a GeoJSON file
 *
 * @param {string} file
 * @returns
 */
exports.loadGeoJSON = function (file) {
    return new Promise(function (resolve, reject) {
        fs.readFile(file, 'utf-8', function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(JSON.parse(data));
            }
        });
    });
};
/**
 * Get all GeoJSON files in a folder
 *
 * @param {string} folder
 * @returns
 */
exports.findGeojsonFilesInFolder = function (folder) {
    return fs.readdirSync(folder).map(function (f) { return path.join(folder, f); }).filter(function (f) {
        var ext = path.extname(f);
        return ext && (ext.toLowerCase() === '.geojson' || ext.toLowerCase() === '.json');
    });
};
/**
 * Create a tile index using geojson-vt
 *
 * @param {string} filename
 * @returns
 */
exports.createTileIndex = function (filename) { return __awaiter(_this, void 0, void 0, function () {
    var geoJSON;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.loadGeoJSON(filename)];
            case 1:
                geoJSON = _a.sent();
                return [2 /*return*/, geojsonvt(geoJSON, {
                        /** max zoom to preserve detail on; can't be higher than 24 */
                        maxZoom: 19,
                        /** simplification tolerance (higher means simpler) */
                        tolerance: 3,
                        /** tile extent (both width and height) */
                        extent: 4096,
                        /** tile buffer on each side */
                        buffer: 64,
                        /** logging level (0 to disable, 1 or 2) */
                        debug: 0,
                        /** max zoom in the initial tile index */
                        indexMaxZoom: 4,
                        /** max number of points per tile in the index */
                        indexMaxPoints: 100000,
                        /** whether to include solid tile children in the index */
                        solidChildren: false
                    })];
        }
    });
}); };
//# sourceMappingURL=utils.js.map