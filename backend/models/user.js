const bcrypt   = require('bcryptjs')
const Joi = require('@hapi/joi');
const JWTService   = require('../services/auth-service')


module.exports = (sequelize, DataTypes) => {
	const Model = sequelize.define('User', {
        id: {allowNull: false, primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4},
        firstname:  {type: DataTypes.STRING},
        lastname: {type: DataTypes.STRING},
        email: {type: DataTypes.STRING},
        phone: {type: DataTypes.STRING},
        role: {type: DataTypes.STRING},
        avatar: {type: DataTypes.STRING},
        password: {type: DataTypes.STRING},
        active:{type: DataTypes.BOOLEAN}
	});

	Model.associate = function(models) {
        
	};

	Model.beforeSave(async (user, options) => {
        let err;
        if (user.changed('password')){
            let salt, hash;
            salt = await bcrypt.genSalt(10);

            hash = await bcrypt.hash(user.password, salt);

            user.password = hash;
        }
    });

    Model.prototype.fullname = async function (){
       if(this.middlename){
            return this.firstname+' '+this.middlename+' '+this.lastname
       }else{
            return this.firstname+' '+this.lastname
       } 
    }

    Model.prototype.comparePassword = async function (pw) {
        let err, pass;

        if(!this.password) {
            return null
        }
        pass = await bcrypt.compare(pw, this.password);

        if(!pass) {
			return null
		}

        return this;
    };

    Model.prototype.getJWT = function (options) {
        let payload = {
            type : 'user',
            _id  : this.id,
            role: this.role,
            email: this.email
        }

        let token = JWTService.sign(payload, options)
        return 'Token '+token
    };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };
	return Model;
};

module.exports.RegisterValidationScema = Joi.object({
    firstname: Joi.string().required()
                .messages({
                    'string.base': `firstname should be of type between a-z`,
                    'any.required': `firstname is a required field`
                }),
    lastname: Joi.string().required()
                .messages({
                    'string.base': `lastname should be of type between a-z`,
                    'any.required': `lastname is a required field`
                }),
    email: Joi.string().email({ minDomainSegments: 2 }).required()
            .messages({
                'string.base': `email should be of type between a-z`,
                'string.email': `email is not valid`,
            }),
    phone: Joi.number().positive().required()
            .messages({
                'number.base': `phone number is not valid`,
                'any.required': `phone number is a required field`,
            }),
    active: Joi.boolean().optional(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).allow('')
            .messages({
                'string.base': `invalid password`,
                'string.pattern.base': `password must only include 'a-z', 'A-Z', '0-9' and must not be less than 3 or more than 12 characters`,
                'any.required': `password is a required field`
            }),
})

module.exports.UpdateValidationScema = Joi.object({
    firstname: Joi.string().required()
                .messages({
                    'string.base': `firstname should be of type between a-z`,
                    'any.required': `firstname is a required field`
                }),
    lastname: Joi.string().required()
                .messages({
                    'string.base': `lastname should be of type between a-z`,
                    'any.required': `lastname is a required field`
                }),
    email: Joi.string().email({ minDomainSegments: 2 }).required()
            .messages({
                'string.base': `email should be of type between a-z`,
                'string.email': `email is not valid`,
            }),
    phone: Joi.number().positive().required()
            .messages({
                'number.base': `phone number is not valid`,
                'any.required': `phone number is a required field`,
            }),
    active: Joi.boolean().optional(),
    id: Joi.string().optional(),
})

module.exports.LoginValidationScema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required()
            .messages({
                'string.base': `email should be of type between a-z`,
                'string.email': `email is not valid`,
                'any.required': `email is required`,
                'any.empty': `email cannot be empty`
            }),
    password: Joi.string().regex(/^[a-zA-Z0-9_]{3,30}$/).allow('')
            .messages({
                'string.base': `invalid password`,
                'string.pattern.base': `password must only include 'a-z', 'A-Z', '0-9' and must not be less than 3 or more than 12 characters`,
                'any.required': `password is a required field`
            }),
})
