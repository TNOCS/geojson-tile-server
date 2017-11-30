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
var path = require("path");
var express = require("express");
var cors = require("cors");
var vtpbf = require("vt-pbf");
var utils_1 = require("./utils");
var vt2geojson_1 = require("./vt2geojson");
var startService = function (filenames, options) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var tileIndexes, countFiles, httpPort, app, send404;
    return __generator(this, function (_a) {
        if (typeof filenames === 'string') {
            filenames = [filenames];
        }
        tileIndexes = {};
        countFiles = filenames.length;
        filenames.forEach(function (f) { return __awaiter(_this, void 0, void 0, function () {
            var layerName, tileIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layerName = path.basename(f).replace(path.extname(f), '');
                        console.log("Processing layer " + layerName + "...");
                        return [4 /*yield*/, utils_1.createTileIndex(f)];
                    case 1:
                        tileIndex = _a.sent();
                        tileIndexes[layerName] = tileIndex;
                        countFiles--;
                        if (countFiles <= 0) {
                            console.log('Finished loading the layers.');
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        httpPort = options.port || process.env.PORT || 8123;
        app = express();
        app.use(cors());
        app.use(express.static(process.env.PUBLIC_FOLDER || './public'));
        send404 = function (res) {
            var availableLayers = Object.keys(tileIndexes).join(', ');
            res.status(404).send("Available layers are " + availableLayers + ". Please create a query using LAYERNAME/z/x/y.ext, where ext is geojson, vt or mvt.");
        };
        app.get('/', function (req, res) { return send404(res); });
        app.get('/:layer/:z/:x/:y.geojson', function (req, res) {
            var layer = req.params['layer'];
            if (!tileIndexes.hasOwnProperty(layer)) {
                send404(res);
            }
            var z = +req.params['z'];
            var x = +req.params['x'];
            var y = +req.params['y'];
            var tile = tileIndexes[layer].getTile(z, x, y);
            if (!tile || !tile.features) {
                return res.json({});
            }
            var vectorTiles = tile.features;
            res.json(vt2geojson_1.toFeatureCollection(vectorTiles, x, y, z));
        });
        app.get('/:layer/:z/:x/:y.vt', function (req, res) {
            var layer = req.params['layer'];
            if (!tileIndexes.hasOwnProperty(layer)) {
                send404(res);
            }
            var z = +req.params['z'];
            var x = +req.params['x'];
            var y = +req.params['y'];
            var tile = tileIndexes[layer].getTile(z, x, y);
            if (!tile || !tile.features) {
                return res.json({});
            }
            var vectorTiles = tile.features;
            res.json(vectorTiles);
        });
        app.get('/:layer/:z/:x/:y.mvt', function (req, res) {
            var layer = req.params['layer'];
            if (!tileIndexes.hasOwnProperty(layer)) {
                send404(res);
            }
            var z = +req.params['z'];
            var x = +req.params['x'];
            var y = +req.params['y'];
            var tile = tileIndexes[layer].getTile(z, x, y);
            if (!tile || !tile.features) {
                return res.json({});
            }
            var buff = vtpbf.fromGeojsonVt({ 'geojsonLayer': tile });
            res.send(buff);
        });
        app.listen(httpPort, function () { return console.info("Tile service is listening on port " + httpPort); });
        return [2 /*return*/];
    });
}); };
exports.createService = function (options) {
    var dataFolder = path.resolve(options.data || process.env.DATAFOLDER || './data');
    console.log("Reading GeoJSON files from " + dataFolder);
    startService(utils_1.findGeojsonFilesInFolder(dataFolder), options);
};
//# sourceMappingURL=server.js.map