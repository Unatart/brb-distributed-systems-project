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
var common_manager_1 = require("../../common/common_manager");
var ts_token_generator_1 = require("ts-token-generator");
var helpers_1 = require("../../helpers");
var AuthManager = /** @class */ (function (_super) {
    __extends(AuthManager, _super);
    function AuthManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.token_gen = new ts_token_generator_1.TokenGenerator({ bitSize: 512, baseEncoding: ts_token_generator_1.TokenBase.BASE62 });
        return _this;
    }
    AuthManager.prototype.create = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.create({
                            user_id: body.user_id,
                            token: this.token_gen.generate(),
                            expires: helpers_1.createDate(true)
                        })];
                    case 1:
                        session = _a.sent();
                        return [4 /*yield*/, this.repository.save(session)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AuthManager.prototype.update = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.findOne({ where: { user_id: id } })];
                    case 1:
                        session = _a.sent();
                        if (!session) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.repository.merge(session, {
                                token: this.token_gen.generate(),
                                expires: helpers_1.createDate(true),
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.repository.save(session)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: throw Error("no such user, sign up pls" /* NO_SUCH_USER */);
                }
            });
        });
    };
    AuthManager.prototype.checkAndUpdate = function (id, token) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.findOne({ where: { user_id: id, token: token } })];
                    case 1:
                        session = _a.sent();
                        if (!session) return [3 /*break*/, 4];
                        if (!this.checkTime(session.expires)) {
                            throw Error("token_expired" /* TOKEN_EXPIRED */);
                        }
                        return [4 /*yield*/, this.repository.merge(session, {
                                token: this.token_gen.generate(),
                                expires: helpers_1.createDate(true),
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.repository.save(session)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: throw Error("no such user, sign up pls" /* NO_SUCH_USER */);
                }
            });
        });
    };
    AuthManager.prototype.serviceCreate = function (key, secret) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.findOne({ where: { service_key: key, service_secret: secret } })];
                    case 1:
                        session = _a.sent();
                        if (!session) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.repository.merge(session, {
                                token: this.token_gen.generate(),
                                expires: helpers_1.createDate(true),
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.repository.save(session)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: throw Error("no such service" /* NO_SUCH_SERVICE */);
                }
            });
        });
    };
    AuthManager.prototype.serviceCheck = function (key, secret, token) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.findOne({
                            where: {
                                service_key: key,
                                service_secret: secret,
                                token: token
                            }
                        })];
                    case 1:
                        session = _a.sent();
                        if (session) {
                            if (this.checkTime(session.expires)) {
                                return [2 /*return*/, session];
                            }
                            throw Error("token_expired" /* TOKEN_EXPIRED */);
                        }
                        throw Error("no such service" /* NO_SUCH_SERVICE */);
                }
            });
        });
    };
    AuthManager.prototype.serviceUpdate = function (key, secret) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.findOne({ where: { service_key: key, service_secret: secret } })];
                    case 1:
                        session = _a.sent();
                        if (!session) return [3 /*break*/, 4];
                        if (!this.checkTime(session.expires)) {
                            throw Error("token_expired" /* TOKEN_EXPIRED */);
                        }
                        return [4 /*yield*/, this.repository.merge(session, {
                                token: this.token_gen.generate(),
                                expires: helpers_1.createDate(true),
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.repository.save(session)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: throw Error("no such service" /* NO_SUCH_SERVICE */);
                }
            });
        });
    };
    AuthManager.prototype.createCode = function (user_id, app_id, app_secret, token) {
        return __awaiter(this, void 0, void 0, function () {
            var find_one, session, session_res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.findOne({ where: { user_id: user_id, token: token, code: null } })];
                    case 1:
                        find_one = _a.sent();
                        if (!find_one) return [3 /*break*/, 4];
                        session = {
                            user_id: user_id,
                            app_id: app_id,
                            app_secret: app_secret,
                            code: this.token_gen.generate()
                        };
                        return [4 /*yield*/, this.repository.create(session)];
                    case 2:
                        session_res = _a.sent();
                        return [4 /*yield*/, this.repository.save(session_res)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthManager.prototype.createTokenForCode = function (code, app_id, app_secret) {
        return __awaiter(this, void 0, void 0, function () {
            var find_same;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.findOne({ where: { code: code, app_id: app_id, app_secret: app_secret } })];
                    case 1:
                        find_same = _a.sent();
                        if (!find_same) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.repository.merge(find_same, {
                                token: this.token_gen.generate(),
                                refresh_token: this.token_gen.generate(),
                                expires: helpers_1.createDate(true),
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.repository.save(find_same)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthManager.prototype.refreshTokenForCode = function (app_id, app_secret, refresh_token) {
        return __awaiter(this, void 0, void 0, function () {
            var find_same;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.findOne({ where: { refresh_token: refresh_token, app_id: app_id, app_secret: app_secret } })];
                    case 1:
                        find_same = _a.sent();
                        if (!find_same) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.repository.merge(find_same, {
                                token: this.token_gen.generate(),
                                refresh_token: this.token_gen.generate(),
                                expires: helpers_1.createDate(true),
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.repository.save(find_same)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthManager.prototype.checkTime = function (expires) {
        var curr_d = new Date(helpers_1.createDate());
        var d = new Date(expires);
        return curr_d.getTime() < d.getTime();
    };
    return AuthManager;
}(common_manager_1.CommonDbManager));
exports.AuthManager = AuthManager;
