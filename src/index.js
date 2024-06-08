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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.pocketbaseAdapter = void 0;
var pocketbase_1 = require("pocketbase");
// Créez une instance de PocketBase avec l'URL de votre serveur PocketBase
var pb = new pocketbase_1.default('http://127.0.0.1:8090');
// Implémenter l'adaptateur en utilisant le type générique
function pocketbaseAdapter() {
    return {
        createUser: function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var data, record, error_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            data = {
                                "username": user.name || '', // Vous pouvez générer un nom d'utilisateur si nécessaire
                                "email": user.email,
                                "password": "defaultPassword123!", // Vous devez gérer la génération et le stockage du mot de passe de manière sécurisée
                                "passwordConfirm": "defaultPassword123!",
                                "name": user.name || '', // Utilisez le nom fourni ou une chaîne vide si non disponible
                                "avatar": user.image || '' // Utilisez l'avatar fourni ou une chaîne vide si non disponible
                            };
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, pb.collection('users').create(data)];
                        case 2:
                            record = _b.sent();
                            // Retournez l'utilisateur créé
                            return [2 /*return*/, (_a = {
                                    id: record.id,
                                    name: record.username,
                                    email: record.email,
                                    emailVerified: null, // L'email n'est pas vérifié
                                    image: null // Pas de gestion d'avatar pour l'instant
                                }) !== null && _a !== void 0 ? _a : null];
                        case 3:
                            error_1 = _b.sent();
                            console.error("Error creating user:", error_1);
                            throw new Error('Failed to create user');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        getUser: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var record, error_2;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, pb.collection('users').getOne(id)];
                        case 1:
                            record = _b.sent();
                            // Retournez l'utilisateur récupéré
                            return [2 /*return*/, (_a = {
                                    id: record.id,
                                    name: record.username || null,
                                    email: record.email,
                                    emailVerified: record.verified ? new Date(record.updated) : null,
                                    image: record.avatar || null // Pas de gestion d'avatar pour l'instant
                                }) !== null && _a !== void 0 ? _a : null];
                        case 2:
                            error_2 = _b.sent();
                            console.error("Error fetching user:", error_2);
                            return [2 /*return*/, null]; // Retournez null si l'utilisateur n'est pas trouvé ou en cas d'erreur
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        getUserByAccount: function (providerAccountId) {
            return __awaiter(this, void 0, void 0, function () {
                var record, userRecord, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, pb.collection('users').getList(1, 1, {
                                    filter: "providerAccountId='".concat(providerAccountId.providerAccountId, "'")
                                })];
                        case 1:
                            record = _a.sent();
                            // Vérifier si un enregistrement a été trouvé
                            if (record.totalItems === 1) {
                                userRecord = record.items[0];
                                return [2 /*return*/, {
                                        id: userRecord.id,
                                        name: userRecord.username || null,
                                        email: userRecord.email,
                                        emailVerified: userRecord.verified ? new Date(userRecord.updated) : null,
                                        image: userRecord.avatar || null // Pas de gestion d'avatar pour l'instant
                                    }];
                            }
                            else {
                                // Aucun utilisateur trouvé
                                return [2 /*return*/, null];
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            console.error("Error fetching user by account:", error_3);
                            return [2 /*return*/, null]; // Retournez null en cas d'erreur
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        updateUser: function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var data, record, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data = {
                                "name": user.name || '', // Nom, facultatif
                                "avatar": user.image !== undefined ? user.image : '' // Avatar, facultatif
                            };
                            // Vérifier si les propriétés de mot de passe sont présentes dans l'objet user
                            if ('oldPassword' in user && 'password' in user && 'passwordConfirm' in user) {
                                // Propriétés de mot de passe fournies, les inclure dans les données de mise à jour
                                data['oldPassword'] = user.oldPassword || ''; // Ancien mot de passe, facultatif
                                data['password'] = user.password || ''; // Nouveau mot de passe, facultatif
                                data['passwordConfirm'] = user.passwordConfirm || ''; // Confirmation du nouveau mot de passe, facultatif
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, pb.collection('users').update(user.id, data)];
                        case 2:
                            record = _a.sent();
                            // Retourner l'utilisateur mis à jour
                            return [2 /*return*/, {
                                    id: record.id,
                                    name: record.username,
                                    email: record.email,
                                    emailVerified: record.verified ? new Date(record.updated) : null,
                                    image: record.avatar || null
                                }];
                        case 3:
                            error_4 = _a.sent();
                            console.error("Error updating user:", error_4);
                            throw new Error('Failed to update user');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        linkAccount: function (account) {
            return __awaiter(this, void 0, void 0, function () {
                var data, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data = {
                                "userId": account.userId, // ID de l'utilisateur auquel le compte sera lié
                                "type": account.type, // Type du compte (OAuth, Email, etc.)
                                "provider": account.provider, // Fournisseur du compte (Google, Facebook, etc.)
                                "providerAccountId": account.providerAccountId, // ID du compte fourni par le fournisseur
                                // Autres propriétés du compte si nécessaire (access_token, refresh_token, etc.)
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, pb.collection('accounts').create(data)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_5 = _a.sent();
                            console.error("Error linking account:", error_5);
                            throw new Error('Failed to link account');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    };
}
exports.pocketbaseAdapter = pocketbaseAdapter;
