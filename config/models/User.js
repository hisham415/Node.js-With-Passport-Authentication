const mongooose = require('mongoose');
const validator = require('validator')
const UserScehma = new mongooose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(x) {
            if (!validator.isLength(x, { min: 6, max: undefined }) || x.includes('password')) {
                throw new Error('password is week')
            }
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
}); 

const User = mongooose.model('User', UserScehma) ;

module.exports =User;   
