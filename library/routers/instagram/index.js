"use strict";
"use-strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var axios_1 = __importDefault(require("axios"));
var crypto_js_1 = __importDefault(require("crypto-js"));
var fs = __importStar(require("fs"));
var form_data_1 = __importDefault(require("form-data"));
var got_1 = __importDefault(require("got"));
var InstagramAPI = /** @class */ (function () {
    function InstagramAPI(username, passwords) {
        var _this = this;
        this.username = username;
        this.passwords = passwords;
        this.BaseInstagram = "https://www.instagram.com/";
        this.WS_URL = "wss://www.instagram.com";
        this.PathSessions = "./sessions_Ra.json";
        this.graphqlInsta = "/graphql/query/";
        this.Sessions = {
            status: false,
            headers: {
                "X-CSRFToken": null,
                "X-Instagram-AJAX": 1,
                "X-Requested-With": "XMLHttpRequest",
                "accept-language": "en-US,en;q=0.9,id;q=0.8",
                cookie: null,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
            },
            _sharedData: null
        };
        this.request = {
            get: function (options, headers) {
                if (!_this.Sessions.status)
                    return new Error("Belum Login");
                return axios_1["default"](__assign(__assign({ headers: __assign(__assign({}, _this.Sessions.headers), headers) }, options), { method: "GET" }));
            },
            post: function (options, headers) {
                if (!_this.Sessions.status)
                    return new Error("Belum Login");
                return axios_1["default"](__assign(__assign({ headers: __assign(__assign({}, _this.Sessions.headers), headers) }, options), { method: "POST" }));
            }
        };
        this.RegexIgUsername = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/([-_0-9A-Za-z]{2,12})/gi;
        this.getIdByUsername = function (username) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var id, data, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!this.Sessions.status)
                                        return [2 /*return*/, reject(new Error("Belum Login"))];
                                    if (this.RegexIgUsername.exec(username))
                                        username = this.RegexIgUsername.exec(username)[1];
                                    id = null;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, 4, 5]);
                                    return [4 /*yield*/, this.request.get({ url: this.BaseInstagram + username + "/?__a=1" })];
                                case 2:
                                    data = _a.sent();
                                    id = data.data.graphql.user.id;
                                    return [3 /*break*/, 5];
                                case 3:
                                    err_1 = _a.sent();
                                    id = null;
                                    return [2 /*return*/, reject(err_1)];
                                case 4: return [2 /*return*/, resolve(id)];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); };
        this.changeProfilePicture = function (media) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var BodyForm, hasil;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!fs.existsSync(media)) return [3 /*break*/, 2];
                                    BodyForm = new form_data_1["default"]();
                                    BodyForm.append("profile_pic", fs.createReadStream(media));
                                    return [4 /*yield*/, this.request.post({
                                            url: this.BaseInstagram + "accounts/web_change_profile_picture/",
                                            data: BodyForm
                                        }, __assign({}, BodyForm.getHeaders()))];
                                case 1:
                                    hasil = _a.sent();
                                    return [2 /*return*/, resolve(hasil.data)];
                                case 2: return [2 /*return*/, reject(new Error("Media Path Tidak Ditemukan"))];
                            }
                        });
                    }); })];
            });
        }); };
        this.getFollowers = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var getId, graphContent, Format, err_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    getId = null;
                                    if (!isNaN(Number(id))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.getIdByUsername(id)];
                                case 1:
                                    getId = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    if (!isNaN(Number(id)))
                                        getId = id;
                                    _a.label = 3;
                                case 3:
                                    _a.trys.push([3, 5, , 6]);
                                    return [4 /*yield*/, this.request.get({
                                            url: this.BaseInstagram + this.graphqlInsta + "?query_hash=" + "37479f2b8209594dde7facb0d904896a" + "&variables=" + JSON.stringify({ id: getId, first: 20 })
                                        })];
                                case 4:
                                    graphContent = _a.sent();
                                    Format = {
                                        total_followers: graphContent.data.data.user.edge_followed_by.count,
                                        list: graphContent.data.data.user.edge_followed_by.edges.map(function (value) { return value.node; })
                                    };
                                    return [2 /*return*/, resolve(Format)];
                                case 5:
                                    err_2 = _a.sent();
                                    throw console.log(new Error("Gagal Mendapatkan data"));
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); };
        this.getFollowings = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var getId, graphContent, Format, err_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    getId = null;
                                    if (!isNaN(Number(id))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.getIdByUsername(id)];
                                case 1:
                                    getId = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    if (!isNaN(Number(id)))
                                        getId = id;
                                    _a.label = 3;
                                case 3:
                                    _a.trys.push([3, 5, , 6]);
                                    return [4 /*yield*/, this.request.get({
                                            url: this.BaseInstagram + this.graphqlInsta + "?query_hash=" + "58712303d941c6855d4e888c5f0cd22f" + "&variables=" + JSON.stringify({ id: getId, first: 20 })
                                        })];
                                case 4:
                                    graphContent = _a.sent();
                                    Format = {
                                        total_followers: graphContent.data.data.user.edge_follow.count,
                                        list: graphContent.data.data.user.edge_follow.edges.map(function (value) { return value.node; })
                                    };
                                    return [2 /*return*/, resolve(Format)];
                                case 5:
                                    err_3 = _a.sent();
                                    throw console.error(new Error("Gagal Mendapatkan data"));
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); };
        this.getInfoBeforeUpdate = function () { return __awaiter(_this, void 0, void 0, function () {
            var respon, Format;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request.get({ url: "" + this.BaseInstagram + this.username + "/?__a=1" })];
                    case 1:
                        respon = _a.sent();
                        Format = {
                            name: respon.data.graphql.user.full_name || "",
                            username: "ra_bot_29",
                            website: "",
                            bio: respon.data.graphql.user.biography || "",
                            email: "",
                            phone: "",
                            gender: ""
                        };
                        return [2 /*return*/, Format];
                }
            });
        }); };
        this.Follow = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var getId, hasil;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    getId = null;
                                    if (!isNaN(Number(id))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.getIdByUsername(id)];
                                case 1:
                                    getId = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    if (!isNaN(Number(id)))
                                        getId = id;
                                    if (!getId)
                                        return [2 /*return*/, reject(new Error("Id Kosong"))];
                                    return [4 /*yield*/, this.request.post({
                                            url: this.BaseInstagram + ("web/friendships/" + getId + "/follow/")
                                        })];
                                case 3:
                                    hasil = _a.sent();
                                    return [2 /*return*/, resolve(hasil.data)];
                            }
                        });
                    }); })];
            });
        }); };
        this.UnFollow = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var getId, hasil;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    getId = null;
                                    if (!isNaN(Number(id))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.getIdByUsername(id)];
                                case 1:
                                    getId = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    if (!isNaN(Number(id)))
                                        getId = id;
                                    if (!getId)
                                        return [2 /*return*/, reject(new Error("Id Kosong"))];
                                    return [4 /*yield*/, this.request.post({
                                            url: this.BaseInstagram + ("web/friendships/" + getId + "/unfollow/")
                                        })];
                                case 3:
                                    hasil = _a.sent();
                                    return [2 /*return*/, resolve(hasil.data)];
                            }
                        });
                    }); })];
            });
        }); };
        this.Block = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var getId, hasil;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    getId = null;
                                    if (!isNaN(Number(id))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.getIdByUsername(id)];
                                case 1:
                                    getId = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    if (!isNaN(Number(id)))
                                        getId = id;
                                    if (!getId)
                                        return [2 /*return*/, reject(new Error("Id Kosong"))];
                                    return [4 /*yield*/, this.request.post({
                                            url: this.BaseInstagram + ("web/friendships/" + getId + "/block/")
                                        })];
                                case 3:
                                    hasil = _a.sent();
                                    return [2 /*return*/, resolve(hasil.data)];
                            }
                        });
                    }); })];
            });
        }); };
        this.UnBlock = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var getId, hasil;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    getId = null;
                                    if (!isNaN(Number(id))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.getIdByUsername(id)];
                                case 1:
                                    getId = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    if (!isNaN(Number(id)))
                                        getId = id;
                                    if (!getId)
                                        return [2 /*return*/, reject(new Error("Id Kosong"))];
                                    return [4 /*yield*/, this.request.post({
                                            url: this.BaseInstagram + ("web/friendships/" + getId + "/unblock/")
                                        })];
                                case 3:
                                    hasil = _a.sent();
                                    return [2 /*return*/, resolve(hasil.data)];
                            }
                        });
                    }); })];
            });
        }); };
        this.Logout = function () { return __awaiter(_this, void 0, void 0, function () {
            var status, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        status = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.request.post({
                                url: this.BaseInstagram + "accounts/logout/ajax/"
                            })];
                    case 2:
                        _a.sent();
                        if (fs.existsSync(this.PathSessions))
                            fs.unlinkSync(this.PathSessions);
                        status = true;
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        status = false;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, status];
                }
            });
        }); };
        this.Login = function (save) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var FormatLogin, getTokenizer, ParseCookie, nrcb, mid, ig_did, CrsfToken, err_5;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 6]);
                                    if (!fs.existsSync(this.PathSessions)) return [3 /*break*/, 1];
                                    this.Sessions = JSON.parse(crypto_js_1["default"].AES.decrypt(fs.readFileSync(this.PathSessions).toString(), "rayyreall").toString(crypto_js_1["default"].enc.Utf8));
                                    return [2 /*return*/, resolve(fs.readFileSync(this.PathSessions).toString())];
                                case 1:
                                    FormatLogin = {
                                        enc_password: "#PWD_INSTAGRAM_BROWSER:0:" + Date.now() + ":" + this.passwords,
                                        username: this.username
                                    };
                                    return [4 /*yield*/, axios_1["default"]({
                                            url: this.BaseInstagram,
                                            method: "GET",
                                            headers: {
                                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
                                            }
                                        })];
                                case 2:
                                    getTokenizer = _a.sent();
                                    ParseCookie = getTokenizer.headers["set-cookie"];
                                    nrcb = /(ig_nrcb=)([0-9]{0,10})\;/i.exec(ParseCookie.find(function (value) { return value.startsWith("ig_nrcb="); }))[2];
                                    mid = /(mid=)([0-9A-Za-z]{14,53})\;/i.exec(ParseCookie.find(function (value) { return value.startsWith("mid="); }))[2];
                                    ig_did = /(ig_did=)([-_0-9A-Za-z]{6,50})/.exec(ParseCookie.find(function (value) { return value.startsWith("ig_did="); }))[2];
                                    CrsfToken = /(csrftoken=)([0-9A-Za-z]{14,53})\;/i.exec(ParseCookie.find(function (value) { return value.startsWith("csrftoken"); }))[2];
                                    return [4 /*yield*/, axios_1["default"]({
                                            url: this.BaseInstagram + "accounts/login/ajax/",
                                            method: "POST",
                                            headers: {
                                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36",
                                                "X-CSRFToken": CrsfToken,
                                                cookie: "ig_nrcb=" + nrcb + "; ig_did=" + ig_did + "; mid=" + mid + "; csrftoken=" + CrsfToken
                                            },
                                            data: new URLSearchParams(Object.entries(FormatLogin))
                                        }).then(function (data) {
                                            var Cookie = data.headers["set-cookie"];
                                            var newCSRF = /(csrftoken=)([0-9A-Za-z]{14,53})\;/i.exec(Cookie.find(function (value) { return value.startsWith("csrftoken"); }))[2];
                                            var sessionsId = Cookie.find(function (value) { return value.startsWith("sessionid="); }).split("sessionid=")[1].split("; Domain=")[0];
                                            _this.Sessions.headers["X-CSRFToken"] = newCSRF;
                                            _this.Sessions.headers.cookie = "csrftoken=" + newCSRF + "; sessionid=" + sessionsId;
                                            _this.Sessions.status = true;
                                            if (save)
                                                fs.writeFileSync(_this.PathSessions, (crypto_js_1["default"].AES.encrypt(JSON.stringify(_this.Sessions, null, 4), "rayyreall").toString()));
                                            return resolve(data.data);
                                        })];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4: return [3 /*break*/, 6];
                                case 5:
                                    err_5 = _a.sent();
                                    return [2 /*return*/, reject(err_5)];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); };
        this.getIdMedia = function (url) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var Regex, data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    Regex = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/(p|reel|tv)\/([-_0-9A-Za-z]{5,18})/gi.exec(url);
                                    if (!Regex)
                                        return [2 /*return*/, reject(new Error("URL Not Support"))];
                                    return [4 /*yield*/, this.request.get({
                                            url: Regex[0] + "/?__a=1"
                                        })];
                                case 1:
                                    data = _a.sent();
                                    return [2 /*return*/, resolve(data.data.graphql.shortcode_media.id)];
                            }
                        });
                    }); })];
            });
        }); };
        this.Komentar = function (id, text, replyID) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var Regex, getId, data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    Regex = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/(p|reel|tv)\/([-_0-9A-Za-z]{5,18})/gi.exec(id);
                                    getId = null;
                                    if (!Regex) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.getIdMedia(id)];
                                case 1:
                                    getId = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    if (!isNaN(Number(id)))
                                        getId = id;
                                    if (!getId)
                                        return [2 /*return*/, reject(new Error("Id Kosong"))];
                                    return [4 /*yield*/, this.request.post({
                                            url: this.BaseInstagram + "web/comments/" + getId + "/add/",
                                            data: new URLSearchParams(Object.entries({ comment_text: text, replied_to_comment_id: replyID || "" }))
                                        })];
                                case 3:
                                    data = _a.sent();
                                    return [2 /*return*/, resolve(data.data)];
                            }
                        });
                    }); })];
            });
        }); };
        this.Like = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var Regex, getId, data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    Regex = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/(p|reel|tv)\/([-_0-9A-Za-z]{5,18})/gi.exec(id);
                                    getId = null;
                                    if (!Regex) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.getIdMedia(id)];
                                case 1:
                                    getId = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    if (!isNaN(Number(id)))
                                        getId = id;
                                    if (!getId)
                                        return [2 /*return*/, reject(new Error("Id Kosong"))];
                                    return [4 /*yield*/, this.request.post({
                                            url: this.BaseInstagram + "web/likes/" + getId + "/like/"
                                        })];
                                case 3:
                                    data = _a.sent();
                                    return [2 /*return*/, resolve(data.data)];
                            }
                        });
                    }); })];
            });
        }); };
        this.unLike = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var Regex, getId, data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    Regex = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/(p|reel|tv)\/([-_0-9A-Za-z]{5,18})/gi.exec(id);
                                    getId = null;
                                    if (!Regex) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.getIdMedia(id)];
                                case 1:
                                    getId = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    if (!isNaN(Number(id)))
                                        getId = id;
                                    if (!getId)
                                        return [2 /*return*/, reject(new Error("Id Kosong"))];
                                    return [4 /*yield*/, this.request.post({
                                            url: this.BaseInstagram + "web/likes/" + getId + "/unlike/"
                                        })];
                                case 3:
                                    data = _a.sent();
                                    return [2 /*return*/, resolve(data.data)];
                            }
                        });
                    }); })];
            });
        }); };
        this.SaveMedia = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var Regex, getId, data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    Regex = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/(p|reel|tv)\/([-_0-9A-Za-z]{5,18})/gi.exec(id);
                                    getId = null;
                                    if (!Regex) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.getIdMedia(id)];
                                case 1:
                                    getId = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    if (!isNaN(Number(id)))
                                        getId = id;
                                    if (!getId)
                                        return [2 /*return*/, reject(new Error("Id Kosong"))];
                                    return [4 /*yield*/, this.request.post({
                                            url: this.BaseInstagram + "web/save/" + getId + "/save/"
                                        })];
                                case 3:
                                    data = _a.sent();
                                    return [2 /*return*/, resolve(data.data)];
                            }
                        });
                    }); })];
            });
        }); };
        this.UnSaveMedia = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var Regex, getId, data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    Regex = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/(p|reel|tv)\/([-_0-9A-Za-z]{5,18})/gi.exec(id);
                                    getId = null;
                                    if (!Regex) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.getIdMedia(id)];
                                case 1:
                                    getId = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    if (!isNaN(Number(id)))
                                        getId = id;
                                    if (!getId)
                                        return [2 /*return*/, reject(new Error("Id Kosong"))];
                                    return [4 /*yield*/, this.request.post({
                                            url: this.BaseInstagram + "web/save/" + getId + "/unsave/"
                                        })];
                                case 3:
                                    data = _a.sent();
                                    return [2 /*return*/, resolve(data.data)];
                            }
                        });
                    }); })];
            });
        }); };
        this.UploadMedia = function (media) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var file, createID, createParams, createNameParams, upload_id, hasil, err_6;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    file = null;
                                    if (!Buffer.isBuffer(media)) return [3 /*break*/, 1];
                                    file = media;
                                    return [3 /*break*/, 5];
                                case 1:
                                    if (!fs.existsSync(media)) return [3 /*break*/, 2];
                                    file = fs.readFileSync(media);
                                    return [3 /*break*/, 5];
                                case 2:
                                    if (!media.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))) return [3 /*break*/, 4];
                                    return [4 /*yield*/, got_1["default"](media, {
                                            method: 'GET',
                                            headers: {
                                                'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
                                            }
                                        }).buffer()];
                                case 3:
                                    file = _a.sent();
                                    return [3 /*break*/, 5];
                                case 4:
                                    file = null;
                                    _a.label = 5;
                                case 5:
                                    if (!file)
                                        return [2 /*return*/, reject(new Error("Media Kosong"))];
                                    createID = Date.now();
                                    createParams = {
                                        media_type: 1,
                                        upload_id: createID.toString(),
                                        upload_media_height: 1080,
                                        upload_media_width: 1080,
                                        xsharing_user_ids: JSON.stringify([]),
                                        image_compression: JSON.stringify({ lib_name: 'moz', lib_version: '3.1.m', quality: '80' })
                                    };
                                    createNameParams = createID + "_0_" + Math.random();
                                    upload_id = null;
                                    _a.label = 6;
                                case 6:
                                    _a.trys.push([6, 8, 9, 10]);
                                    return [4 /*yield*/, this.request.post({
                                            url: this.BaseInstagram + "rupload_igphoto/" + createNameParams,
                                            data: file
                                        }, {
                                            'x-entity-type': 'image/jpeg',
                                            offset: 0,
                                            'x-entity-name': createNameParams,
                                            'x-instagram-rupload-params': JSON.stringify(createParams),
                                            'x-entity-length': file.byteLength,
                                            'Content-Length': file.byteLength,
                                            'Content-Type': 'application/octet-stream',
                                            'x-ig-app-id': "1217981644879628",
                                            'Accept-Encoding': 'gzip',
                                            'X-Pigeon-Rawclienttime': (Date.now() / 1000).toFixed(3),
                                            'X-IG-Connection-Speed': Math.random() + "kbps",
                                            'X-IG-Bandwidth-Speed-KBPS': '-1.000',
                                            'X-IG-Bandwidth-TotalBytes-B': '0',
                                            'X-IG-Bandwidth-TotalTime-MS': '0'
                                        })];
                                case 7:
                                    hasil = _a.sent();
                                    upload_id = hasil.data.upload_id;
                                    return [3 /*break*/, 10];
                                case 8:
                                    err_6 = _a.sent();
                                    return [2 /*return*/, reject(new Error(String(err_6)))];
                                case 9: return [2 /*return*/, resolve(upload_id)];
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); };
        this.uploadMediaPost = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/];
                        });
                    }); })];
            });
        }); };
    }
    ;
    return InstagramAPI;
}());
exports["default"] = InstagramAPI;
//# sourceMappingURL=index.js.map