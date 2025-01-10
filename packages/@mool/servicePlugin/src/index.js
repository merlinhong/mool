"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = Service;
var createMockServer_1 = require("./createMockServer");
var fs_1 = require("fs");
var node_path_1 = require("node:path");
var chokidar_1 = require("chokidar");
var mitt_1 = require("./mitt");
var getServiceDir = function (path) { return (0, node_path_1.join)(process.cwd(), path !== null && path !== void 0 ? path : "./src/service"); };
function generateServiceTypes(opt) {
    var _a;
    var typesPath = (0, node_path_1.join)(process.cwd(), (_a = opt === null || opt === void 0 ? void 0 : opt.dts) !== null && _a !== void 0 ? _a : "service.d.ts");
    var serviceFiles = fs_1.default
        .readdirSync(getServiceDir(opt === null || opt === void 0 ? void 0 : opt.path))
        .filter(function (file) { return file.endsWith(".ts") && file !== "index.ts"; })
        .map(function (file) { return file.replace(".ts", ""); });
    var moduleTypes = serviceFiles
        .map(function (module) {
        var _a;
        return "\n    ".concat(module, ": typeof import(\"").concat((_a = opt === null || opt === void 0 ? void 0 : opt.path) !== null && _a !== void 0 ? _a : "src/service", "/").concat(module, "\")['default'];\n    ");
    })
        .join("");
    var typeContent = "// Auto-generated file\nexport {};\ndeclare global {\n  interface ServiceTypes {\n    ".concat(moduleTypes, "\n  };\n};\n");
    fs_1.default.writeFileSync(typesPath, typeContent);
}
// 可以在构建或开发时调用此函数
function Service(opt) {
    var _a;
    opt = opt || {};
    if (opt === null || opt === void 0 ? void 0 : opt.mock) {
        opt.mock.mockPath = ((_a = opt.mock.mockPath) !== null && _a !== void 0 ? _a : opt === null || opt === void 0 ? void 0 : opt.path) || "./src/service";
    }
    var isDev = false;
    var config;
    var timer = undefined;
    function clear() {
        clearTimeout(timer);
    }
    function schedule(fn) {
        clear();
        timer = setTimeout(fn, 500);
    }
    return [
        {
            name: "vite-plugin-service",
            apply: "serve",
            config: function (c) {
                if (!c.server)
                    c.server = {};
                if (!c.server.watch)
                    c.server.watch = {};
                c.server.watch.disableGlobbing = false;
            },
            configResolved: function (resolvedConfig) {
                config = resolvedConfig;
                isDev = config.command === "serve";
                isDev && (opt === null || opt === void 0 ? void 0 : opt.mock) && (0, createMockServer_1.createMockServer)(opt.mock, config);
            },
            configureServer: function (server) {
                return __awaiter(this, void 0, void 0, function () {
                    var watcher, _a, enable, middleware;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                mitt_1.default.on("update", function () {
                                    schedule(function () {
                                        server.restart();
                                    });
                                });
                                watcher = chokidar_1.default.watch(getServiceDir(opt === null || opt === void 0 ? void 0 : opt.path), {
                                    ignored: /(^|[\/\\])\../, // 忽略隐藏文件
                                    persistent: true,
                                    depth: 1,
                                });
                                // 监听文件变化
                                watcher.on("all", function () {
                                    generateServiceTypes(opt);
                                });
                                if (!(opt === null || opt === void 0 ? void 0 : opt.mock)) return [3 /*break*/, 2];
                                _a = opt.mock.enable, enable = _a === void 0 ? isDev : _a;
                                if (!enable) {
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, (0, createMockServer_1.requestMiddleware)(opt.mock)];
                            case 1:
                                middleware = _c.sent();
                                server.middlewares.use(middleware);
                                _c.label = 2;
                            case 2:
                                // 服务器关闭时关闭监听器
                                (_b = server.httpServer) === null || _b === void 0 ? void 0 : _b.on("close", function () {
                                    watcher.close();
                                });
                                return [2 /*return*/];
                        }
                    });
                });
            },
            handleHotUpdate: function (ctx) { },
            buildStart: function () {
                generateServiceTypes(opt);
            },
        },
    ];
}
