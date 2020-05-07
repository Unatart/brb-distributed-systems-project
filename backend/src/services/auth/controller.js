"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var common_controller_1 = require("../../common/common_controller");
var host_config_1 = require("../../common/host_config");
var request = require("request-promise");
var queue_1 = require("../../common/queue");
var helpers_1 = require("../../helpers");
var AuthController = /** @class */ (function (_super) {
    __extends(AuthController, _super);
    function AuthController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // USER
        _this.signOut = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var user_res, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, request({
                                method: "POST",
                                headers: { 'Content-Type': 'application/json' },
                                body: req.body,
                                uri: "http://localhost:" + host_config_1.host.USER.port + "/users/",
                                json: true
                            }).catch(function (error) {
                                return res
                                    .status(400)
                                    .send(error.message);
                            })];
                    case 1:
                        user_res = _a.sent();
                        return [4 /*yield*/, this.db_manager.create(user_res)];
                    case 2:
                        result = _a.sent();
                        queue_1.queue.push({
                            user_id: result.user_id,
                            service_name: host_config_1.host.AUTH.name,
                            method: "POST",
                            time: helpers_1.createDate(),
                            body: req.body,
                            extra: "signOut"
                        });
                        return [2 /*return*/, res
                                .status(201)
                                .send(result)];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, res
                                .status(404)
                                .send(error_1.message)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.signIn = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var user_res, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, request({
                                method: "GET",
                                headers: { 'Content-Type': 'application/json' },
                                body: req.body,
                                uri: "http://localhost:" + host_config_1.host.USER.port + "/users/",
                                json: true
                            }).catch(function (error) {
                                return res
                                    .status(404)
                                    .send(error.message);
                            })];
                    case 1:
                        user_res = _a.sent();
                        return [4 /*yield*/, this.db_manager.update(user_res.user_id)];
                    case 2:
                        result = _a.sent();
                        queue_1.queue.push({
                            user_id: result.user_id,
                            service_name: host_config_1.host.AUTH.name,
                            method: "POST",
                            time: helpers_1.createDate(),
                            body: req.body,
                            extra: "signIn"
                        });
                        return [2 /*return*/, res
                                .status(200)
                                .send(result)];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, res
                                .status(404)
                                .send(error_2.message)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.checkToken = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var id, token, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        token = req.query.token;
                        if (!this.uuid_regex.test(id)) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .send("uid don't match regex" /* UID_REGEX_MATCH */)];
                        }
                        return [4 /*yield*/, this.db_manager.checkAndUpdate(id, token)];
                    case 1:
                        result = _a.sent();
                        queue_1.queue.push({
                            user_id: id,
                            service_name: host_config_1.host.AUTH.name,
                            method: "GET",
                            time: helpers_1.createDate(),
                            body: req.body,
                            extra: "checkToken"
                        });
                        return [2 /*return*/, res
                                .status(200)
                                .send(result)];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, res
                                .status(404)
                                .send(error_3.message)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // SERVICE
        _this.createTokenForService = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db_manager.serviceCreate(req.body.service_key, req.body.service_secret)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, res
                                .status(201)
                                .send(result)];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, res
                                .status(404)
                                .send(error_4.message)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.checkTokenForService = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db_manager.serviceCheck(req.body.service_key, req.body.service_secret, req.body.token)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, res
                                .status(200)
                                .send(result)];
                    case 2:
                        error_5 = _a.sent();
                        return [2 /*return*/, res
                                .status(404)
                                .send(error_5.message)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.updateTokenForService = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db_manager.serviceUpdate(req.body.service_key, req.body.service_secret)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, res
                                .status(200)
                                .send(result)];
                    case 2:
                        error_6 = _a.sent();
                        return [2 /*return*/, res
                                .status(404)
                                .send(error_6.message)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // 3RD PARTY APP
        _this.createCode = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var client_id, client_secret, user_id, token, result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        client_id = req.query.client_id;
                        client_secret = req.query.client_secret;
                        user_id = req.query.user_id;
                        token = req.query.token;
                        return [4 /*yield*/, this.db_manager.createCode(user_id, client_id, client_secret, token)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            return [2 /*return*/, res
                                    .status(200)
                                    .send(result)];
                        }
                        return [2 /*return*/, res
                                .status(401)
                                .send(result)];
                    case 2:
                        error_7 = _a.sent();
                        return [2 /*return*/, res
                                .status(400)
                                .send(error_7.message)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.getToken = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var client_id, client_secret, grant_type, code, result, refresh_token, result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        client_id = req.query.client_id;
                        client_secret = req.query.client_secret;
                        grant_type = req.query.grant_type;
                        if (!(grant_type === "auth_code")) return [3 /*break*/, 2];
                        code = req.query.code;
                        return [4 /*yield*/, this.db_manager.createTokenForCode(code, client_id, client_secret)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            return [2 /*return*/, res
                                    .status(200)
                                    .send(result)];
                        }
                        return [2 /*return*/, res
                                .status(401)
                                .send(result)];
                    case 2:
                        if (!(grant_type === "refresh_token")) return [3 /*break*/, 4];
                        refresh_token = req.query.refresh_token;
                        return [4 /*yield*/, this.db_manager.refreshTokenForCode(client_id, client_secret, refresh_token)];
                    case 3:
                        result = _a.sent();
                        if (result) {
                            return [2 /*return*/, res
                                    .status(200)
                                    .send(result)];
                        }
                        return [2 /*return*/, res
                                .status(401)
                                .send(result)];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_8 = _a.sent();
                        return [2 /*return*/, res
                                .status(400)
                                .send(error_8.message)];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    return AuthController;
}(common_controller_1.CommonController));
exports.AuthController = AuthController;
