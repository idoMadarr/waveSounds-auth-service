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
exports.signOut = exports.getFavorites = exports.addFavorite = exports.signIn = exports.signUp = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var bad_request_error_1 = require("../errors/bad-request-error");
var User_1 = require("../models/User");
var Favorite_1 = require("../models/Favorite");
var signUp = function (req, res, _next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, username, password, existUser, hashingPassword, createUser, payload, userJwt, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, username = _a.username, password = _a.password;
                return [4 /*yield*/, User_1.User.find({ email: email })];
            case 1:
                existUser = _b.sent();
                if (existUser.length) {
                    throw new bad_request_error_1.BadRequestError('Email in use');
                }
                return [4 /*yield*/, User_1.User.toHash(password)];
            case 2:
                hashingPassword = _b.sent();
                createUser = User_1.User.build({ email: email, username: username, password: hashingPassword });
                return [4 /*yield*/, createUser.save()];
            case 3:
                _b.sent();
                Favorite_1.Favorite.buildRepo(createUser.id);
                payload = {
                    id: createUser.id,
                    email: createUser.email,
                };
                userJwt = jsonwebtoken_1.sign(payload, process.env.JWT_KEY);
                req.session = { userJwt: userJwt };
                response = { userJwt: userJwt, createUser: createUser };
                res.status(200).send(response);
                return [2 /*return*/];
        }
    });
}); };
exports.signUp = signUp;
var signIn = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, existUser, passwordMatch, payload, userJwt, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, User_1.User.findOne({ email: email })];
            case 1:
                existUser = _b.sent();
                if (!existUser) {
                    throw new bad_request_error_1.BadRequestError('Invalid credentials');
                }
                return [4 /*yield*/, User_1.User.toCompare(password, existUser.password)];
            case 2:
                passwordMatch = _b.sent();
                if (!passwordMatch) {
                    throw new bad_request_error_1.BadRequestError('Invalid password, please try again');
                }
                payload = { id: existUser.id, email: existUser.email };
                userJwt = jsonwebtoken_1.sign(payload, process.env.JWT_KEY);
                req.session = { userJwt: userJwt };
                response = { userJwt: userJwt, existUser: existUser };
                res.status(200).send(response);
                return [2 /*return*/];
        }
    });
}); };
exports.signIn = signIn;
var addFavorite = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var favoriteCredentials, newFavorite;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                favoriteCredentials = {
                    user: req.currentUser.id,
                    track: __assign({}, req.body),
                };
                return [4 /*yield*/, Favorite_1.Favorite.addFavorite(favoriteCredentials)];
            case 1:
                newFavorite = _a.sent();
                if (!newFavorite) {
                    throw new bad_request_error_1.BadRequestError('Favorite already exists');
                }
                res.send(newFavorite);
                return [2 /*return*/];
        }
    });
}); };
exports.addFavorite = addFavorite;
var getFavorites = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userFavories;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Favorite_1.Favorite.findOne({ user: req.currentUser.id })];
            case 1:
                userFavories = _a.sent();
                res.send(userFavories === null || userFavories === void 0 ? void 0 : userFavories.repo);
                return [2 /*return*/];
        }
    });
}); };
exports.getFavorites = getFavorites;
var signOut = function (req, res, next) {
    req.session = { userJwt: null };
    res.send({});
};
exports.signOut = signOut;
