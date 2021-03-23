const Joi = require('@hapi/joi');
const JWTService   = require('../services/auth-service')

module.exports = (sequelize, DataTypes) => {
	const Model = sequelize.define('Employee', {
                firstname:{type: DataTypes.STRING},
                lastname:{type: DataTypes.STRING},
                phone:{type: DataTypes.STRING}, 
                dob:  {type: DataTypes.DATE},
                country:  {type: DataTypes.STRING},
                city: {type: DataTypes.STRING},
                address:  {type: DataTypes.STRING},
                gender:{type: DataTypes.STRING},
                avatar: {type: DataTypes.STRING},
	});

	Model.associate = function(models) {
                Model.belongsTo(models.Company, {foreignKey: 'companyId', as: 'company'})
                Model.belongsTo(models.Department, {foreignKey: 'departmentId', as: 'department'})
                Model.belongsTo(models.Account, {foreignKey: 'accountId', as: 'user'})
        };

    return Model;
};
