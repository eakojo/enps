const bcrypt   = require('bcryptjs')
const JWTService   = require('../services/auth-service')

module.exports = (sequelize, DataTypes) => {
	const Model = sequelize.define('Account', {
        id: {allowNull: false, primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4},
        email: {type: DataTypes.STRING},
        role: {type: DataTypes.STRING},
        password: {type: DataTypes.STRING},
        active:{type: DataTypes.BOOLEAN}
	});

	Model.associate = function(models) {
        Model.hasOne(models.Employee, {foreignKey: 'accountId', as: 'profile'})
        Model.hasOne(models.Management, {foreignKey: 'accountId', as: 'management'})
        Model.belongsTo(models.Company, {foreignKey: 'companyId', as: 'company'})
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
    }

    Model.prototype.getJWT = function (options) {
        let payload = {
            type : 'user',
            _id  : this.id,
            _role: this.role,
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
}