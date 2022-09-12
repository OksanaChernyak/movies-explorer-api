const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../utils/UnauthorizedError');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: isEmail,
        },
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});

userSchema.statics.findUserByCredentials = function (email, password) {
    return this.findOne({ email }).select('+password')
        .then((user) => {
            if (!user) {
                throw new UnauthorizedError('Неправильные почта или пароль');
            }
            return bcrypt.compare(password, user.password)
                .then((matched) => {
                    if (!matched) {
                        throw new UnauthorizedError('Неправильные почта или пароль');
                    }
                    return user;
                });
        });
};

module.exports = mongoose.model('user', userSchema);