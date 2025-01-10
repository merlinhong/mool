"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockData = void 0;
exports.createMockServer = createMockServer;
exports.requestMiddleware = requestMiddleware;
var node_path_1 = require("node:path");
var node_fs_1 = require("node:fs");
var chokidar_1 = require("chokidar");
var picocolors_1 = require("picocolors");
var url_1 = require("url");
var fast_glob_1 = require("fast-glob");
var mockjs_1 = require("mockjs");
var path_to_regexp_1 = require("path-to-regexp");
var utils_1 = require("./utils");
var bundle_require_1 = require("bundle-require");
var mitt_1 = require("./mitt");
exports.mockData = [];
function createMockServer() {
    return __awaiter(this, arguments, void 0, function (opt, config) {
        var data;
        if (opt === void 0) { opt = { mockPath: "service", configPath: "service.config" }; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opt = __assign({ mockPath: "service", watchFiles: false, configPath: "service.config.ts", logger: true, cors: true }, opt);
                    if (exports.mockData.length > 0)
                        return [2 /*return*/];
                    node_fs_1.default.mkdirSync(node_path_1.default.resolve(config.root, "node_modules/.api"), { recursive: true });
                    return [4 /*yield*/, getMockConfig(opt, config)];
                case 1:
                    data = _a.sent();
                    data.forEach(function (item) {
                        exports.mockData.push.apply(exports.mockData, Object.values(item));
                    });
                    exports.mockData = exports.mockData.map(function (item) {
                        return __assign(__assign({}, item), item.mock);
                    });
                    return [4 /*yield*/, createWatch(opt, config)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// request match
function requestMiddleware(opt) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, logger, middleware;
        var _this = this;
        return __generator(this, function (_b) {
            _a = opt.logger, logger = _a === void 0 ? true : _a;
            middleware = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var queryParams, reqUrl, matchRequest, isGet, _a, response, rawResponse, timeout, statusCode, url_2, urlMatch, query, params, self_1, body, mockResponse;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            queryParams = {};
                            if (req.url) {
                                queryParams = url_1.default.parse(req.url, true);
                            }
                            reqUrl = queryParams.pathname;
                            matchRequest = exports.mockData.find(function (item) {
                                if (!reqUrl || !item || !item.url) {
                                    return false;
                                }
                                if (item.method && item.method.toUpperCase() !== req.method) {
                                    return false;
                                }
                                return (0, path_to_regexp_1.pathToRegexp)(item.url).test(reqUrl);
                            });
                            if (!matchRequest) return [3 /*break*/, 7];
                            isGet = req.method && req.method.toUpperCase() === "GET";
                            if (!matchRequest.mock) {
                                loggerOutput("No found Mock", req.url);
                                res.setHeader("Content-Type", "text/plain");
                                res.statusCode = 404;
                                return [2 /*return*/, res.end('No found Mock')];
                            }
                            _a = matchRequest.mock, response = _a.response, rawResponse = _a.rawResponse, timeout = _a.timeout, statusCode = _a.statusCode, url_2 = matchRequest.url;
                            if (!timeout) return [3 /*break*/, 2];
                            return [4 /*yield*/, (0, utils_1.sleep)(timeout)];
                        case 1:
                            _b.sent();
                            _b.label = 2;
                        case 2:
                            urlMatch = (0, path_to_regexp_1.match)(url_2, { decode: decodeURIComponent });
                            query = queryParams.query;
                            if (reqUrl) {
                                if ((isGet && JSON.stringify(query) === "{}") || !isGet) {
                                    params = urlMatch(reqUrl).params;
                                    if (JSON.stringify(params) !== "{}") {
                                        query = urlMatch(reqUrl).params || {};
                                    }
                                    else {
                                        query = queryParams.query || {};
                                    }
                                }
                            }
                            self_1 = { req: req, res: res, parseJson: parseJson.bind(null, req) };
                            if (!(0, utils_1.isFunction)(rawResponse)) return [3 /*break*/, 4];
                            return [4 /*yield*/, (rawResponse === null || rawResponse === void 0 ? void 0 : rawResponse.bind(self_1)(req, res))];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, parseJson(req)];
                        case 5:
                            body = _b.sent();
                            res.setHeader("Content-Type", "application/json");
                            if (opt) {
                                res.setHeader("Access-Control-Allow-Credentials", 'true');
                                res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
                            }
                            res.statusCode = statusCode || 200;
                            mockResponse = (0, utils_1.isFunction)(response)
                                ? response.bind(self_1)({ url: req.url, body: body, query: query, headers: req.headers })
                                : response;
                            res.end(JSON.stringify(mockjs_1.default.mock(mockResponse)));
                            _b.label = 6;
                        case 6:
                            logger && loggerOutput("request invoke", req.url);
                            return [2 /*return*/];
                        case 7:
                            next();
                            return [2 /*return*/];
                    }
                });
            }); };
            return [2 /*return*/, middleware];
        });
    });
}
// create watch mock
function createWatch(opt, config) {
    var _this = this;
    var configPath = opt.configPath, logger = opt.logger, watchFiles = opt.watchFiles;
    if (!watchFiles) {
        return;
    }
    var _a = getPath(opt), absConfigPath = _a.absConfigPath, absMockPath = _a.absMockPath;
    if (process.env.VITE_DISABLED_WATCH_MOCK === "true") {
        return;
    }
    var watchDir = [];
    var exitsConfigPath = node_fs_1.default.existsSync(absConfigPath);
    exitsConfigPath && configPath ? watchDir.push(absConfigPath) : watchDir.push(absMockPath);
    var watcher = chokidar_1.default.watch(watchDir, {
        ignoreInitial: true,
        // ignore files generated by `bundle require`
        ignored: /\.mjs$|\.cjs$|\.mts$/,
        persistent: true,
    });
    var mockUpdate = false;
    watcher.on("all", function (event, file) { return __awaiter(_this, void 0, void 0, function () {
        var data, newMockData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger && loggerOutput("mock file ".concat(event), file);
                    return [4 /*yield*/, getMockConfig(opt, config)];
                case 1:
                    data = _a.sent();
                    newMockData = [];
                    data.forEach(function (item, index) {
                        newMockData.push.apply(newMockData, Object.values(item));
                    });
                    exports.mockData = newMockData.map(function (item, index) {
                        if ((item.mock || exports.mockData[index].mock) && !(0, utils_1.deepEqual)(exports.mockData[index].mock, item.mock)) {
                            mockUpdate = true;
                        }
                        return __assign(__assign({}, item), item.mock);
                    });
                    mockUpdate && mitt_1.default.emit("update", loggerOutput("mockdata updated", file));
                    mockUpdate = false;
                    return [2 /*return*/];
            }
        });
    }); });
}
// clear cache
function cleanRequireCache(opt) {
    if (typeof require === "undefined" || !require.cache) {
        return;
    }
    var _a = getPath(opt), absConfigPath = _a.absConfigPath, absMockPath = _a.absMockPath;
    Object.keys(require.cache).forEach(function (file) {
        if (file === absConfigPath || file.indexOf(absMockPath) > -1) {
            delete require.cache[file];
        }
    });
}
function parseJson(req) {
    return new Promise(function (resolve) {
        var jsonStr = {};
        var str = "";
        req.on("data", function (chunk) {
            str += chunk;
        });
        req.on("end", function () {
            try {
                // json
                jsonStr = JSON.parse(str);
            }
            catch (e) {
                // x-www-form-urlencoded
                var params = new URLSearchParams(str);
                var body_1 = {};
                params.forEach(function (value, key) {
                    body_1[key] = value;
                });
                jsonStr = body_1;
            }
            resolve(jsonStr);
            return;
        });
    });
}
// load mock .ts files and watch
function getMockConfig(opt, config) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, absConfigPath, absMockPath, ignore, configPath, logger, ret, mockFiles, resolveModulePromiseList, index, mockFile, loadAllResult, _i, loadAllResult_1, resultModule, mod, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = getPath(opt), absConfigPath = _a.absConfigPath, absMockPath = _a.absMockPath;
                    ignore = opt.ignore, configPath = opt.configPath, logger = opt.logger;
                    ret = [];
                    if (!(configPath && node_fs_1.default.existsSync(absConfigPath))) return [3 /*break*/, 2];
                    logger && loggerOutput("load mock data from", absConfigPath);
                    return [4 /*yield*/, resolveModule(absConfigPath, config)];
                case 1:
                    ret = _b.sent();
                    return [2 /*return*/, ret];
                case 2:
                    mockFiles = fast_glob_1.default
                        .sync("**/*.{ts,mjs,js}", {
                        cwd: absMockPath,
                    })
                        .filter(function (item) {
                        if (!ignore) {
                            return true;
                        }
                        if ((0, utils_1.isFunction)(ignore)) {
                            return !ignore(item);
                        }
                        if ((0, utils_1.isRegExp)(ignore)) {
                            return !ignore.test(node_path_1.default.basename(item));
                        }
                        return true;
                    });
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    ret = [];
                    resolveModulePromiseList = [];
                    for (index = 0; index < mockFiles.length; index++) {
                        mockFile = mockFiles[index];
                        resolveModulePromiseList.push(resolveModule(node_path_1.default.join(absMockPath, mockFile), config));
                    }
                    return [4 /*yield*/, Promise.all(resolveModulePromiseList)];
                case 4:
                    loadAllResult = _b.sent();
                    for (_i = 0, loadAllResult_1 = loadAllResult; _i < loadAllResult_1.length; _i++) {
                        resultModule = loadAllResult_1[_i];
                        mod = resultModule;
                        if (!(0, utils_1.isArray)(mod)) {
                            mod = [mod];
                        }
                        ret = __spreadArray(__spreadArray([], ret, true), mod, true);
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    loggerOutput("mock reload error", error_1);
                    ret = [];
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, ret];
            }
        });
    });
}
// fixed file generation format
// use a random path to avoid import cache
var getOutputFile = function (filepath, format) {
    var dirname = node_path_1.default.dirname(filepath);
    var basename = node_path_1.default.basename(filepath);
    var randomname = "".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 15));
    return node_path_1.default.resolve("node_modules/.api", "_".concat(basename.replace(bundle_require_1.JS_EXT_RE, ".bundled_".concat(randomname, ".").concat(format === "esm" ? "mjs" : "cjs"))));
};
// Inspired by vite
// support mock .ts files
function resolveModule(p, config) {
    return __awaiter(this, void 0, void 0, function () {
        var mockData, mod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, bundle_require_1.bundleRequire)({
                        filepath: p,
                        getOutputFile: getOutputFile,
                    })];
                case 1:
                    mockData = _a.sent();
                    mod = mockData.mod.default || mockData.mod;
                    if (!(0, utils_1.isFunction)(mod)) return [3 /*break*/, 3];
                    return [4 /*yield*/, mod({ env: config.env, mode: config.mode, command: config.command })];
                case 2:
                    mod = _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, mod];
            }
        });
    });
}
// get custom config file path and mock dir path
function getPath(opt) {
    var mockPath = opt.mockPath, configPath = opt.configPath;
    if (!mockPath) {
        throw new Error('Not Found mock file');
    }
    var cwd = process.cwd();
    var absMockPath = (0, utils_1.isAbsPath)(mockPath) ? mockPath : node_path_1.default.join(cwd, mockPath || "");
    var absConfigPath = node_path_1.default.join(cwd, configPath || "");
    return {
        absMockPath: absMockPath,
        absConfigPath: absConfigPath,
    };
}
function loggerOutput(title, msg, type) {
    if (type === void 0) { type = "info"; }
    var tag = type === "info" ? picocolors_1.default.cyan("[vite:mock]") : picocolors_1.default.red("[vite:mock-server]");
    return console.log("".concat(picocolors_1.default.dim(new Date().toLocaleTimeString()), " ").concat(tag, " ").concat(picocolors_1.default.green(title), " ").concat(picocolors_1.default.dim(msg)));
}
