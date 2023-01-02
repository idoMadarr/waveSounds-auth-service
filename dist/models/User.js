"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose_1 = require("mongoose");
var bcryptjs_1 = require("bcryptjs");
var userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        },
    },
});
userSchema.statics.build = function (credentials) {
    return new exports.User(credentials);
};
userSchema.statics.toHash = function (password) { return bcryptjs_1.hash(password, 12); };
userSchema.statics.toCompare = function (inputPassword, storedPassword) { return bcryptjs_1.compare(inputPassword, storedPassword); };
exports.User = mongoose_1.model('User', userSchema);
