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
var helpers_1 = require("../../helpers");
var queue_1 = require("../../common/queue");
var MsgController = /** @class */ (function (_super) {
    __extends(MsgController, _super);
    function MsgController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.get = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var uuid, guid, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        uuid = req.params.user_id;
                        guid = req.params.group_id;
                        if (!(this.uuid_regex.test(uuid) && this.uuid_regex.test(guid))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db_manager.get(uuid, guid)];
                    case 1:
                        result = _a.sent();
                        queue_1.queue.push({
                            user_id: req.query.user_id,
                            service_name: host_config_1.host.MSG.name,
                            method: "GET",
                            time: helpers_1.createDate(),
                            body: req.body,
                            extra: "getMsg"
                        });
                        return [2 /*return*/, res
                                .status(200)
                                .send(result)];
                    case 2: return [2 /*return*/, res
                            .status(400)
                            .send("uid don't match regex" /* UID_REGEX_MATCH */)];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, res
                                .status(404)
                                .send(error_1.message)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.set = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var body, user, group, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        body = req.body;
                        if (!this.uuid_regex.test(body.user_id) || !this.uuid_regex.test(body.group_id)) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .send("uid don't match regex" /* UID_REGEX_MATCH */)];
                        }
                        return [4 /*yield*/, helpers_1.getThroughMiddleware(body.user_id, host_config_1.host.USER.port + "/users", this.token)];
                    case 1:
                        user = _a.sent();
                        this.token = user.token;
                        if (!(user.exist === true)) return [3 /*break*/, 5];
                        return [4 /*yield*/, helpers_1.getThroughMiddleware(body.group_id, host_config_1.host.GROUP.port + "/groups", this.token)];
                    case 2:
                        group = _a.sent();
                        if (!(group.exist === true)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.db_manager.set(body)];
                    case 3:
                        result = _a.sent();
                        queue_1.queue.push({
                            user_id: req.query.user_id,
                            service_name: host_config_1.host.MSG.name,
                            method: "POST",
                            time: helpers_1.createDate(),
                            body: req.body,
                            extra: "setMsg"
                        });
                        return [2 /*return*/, res
                                .status(200)
                                .send(result)];
                    case 4: return [2 /*return*/, res
                            .status(404)
                            .send(group)];
                    case 5: return [2 /*return*/, res
                            .status(404)
                            .send(user)];
                    case 6:
                        error_2 = _a.sent();
                        return [2 /*return*/, res
                                .status(404)
                                .send(error_2.message)];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        _this.update = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var body, user, group, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        body = req.body;
                        return [4 /*yield*/, helpers_1.getThroughMiddleware(body.user_id, host_config_1.host.USER.port + "/users", this.token)];
                    case 1:
                        user = _a.sent();
                        this.token = user.token;
                        if (!(user.exist === true)) return [3 /*break*/, 5];
                        return [4 /*yield*/, helpers_1.getThroughMiddleware(body.group_id, host_config_1.host.GROUP.port + "/groups", this.token)];
                    case 2:
                        group = _a.sent();
                        if (!(group.exist === true)) return [3 /*break*/, 4];
                        if (!this.uuid_regex.test(body.user_id) || !this.uuid_regex.test(body.group_id)) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .send("uid don't match regex" /* UID_REGEX_MATCH */)];
                        }
                        return [4 /*yield*/, this.db_manager.update(req.params.id, body)];
                    case 3:
                        result = _a.sent();
                        queue_1.queue.push({
                            user_id: req.query.user_id,
                            service_name: host_config_1.host.MSG.name,
                            method: "PATCH",
                            time: helpers_1.createDate(),
                            body: req.body,
                            extra: "updateMsg"
                        });
                        return [2 /*return*/, res
                                .status(200)
                                .send(result)];
                    case 4: return [2 /*return*/, res
                            .status(404)
                            .send(group)];
                    case 5: return [2 /*return*/, res
                            .status(404)
                            .send(user)];
                    case 6:
                        error_3 = _a.sent();
                        return [2 /*return*/, res
                                .status(400)
                                .send(error_3.message)];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    return MsgController;
}(common_controller_1.CommonController));
exports.MsgController = MsgController;
