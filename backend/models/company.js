
module.exports = (sequelize, DataTypes) => {
	const Model = sequelize.define('Company', {
        name: {type: DataTypes.STRING},
        description:  {type: DataTypes.STRING},
        logo: {type: DataTypes.STRING},
        active:{type: DataTypes.BOOLEAN}
	});

	Model.associate = function(models) {
                Model.hasMany(models.Department, {foreignKey: 'companyId', as: 'departments'})
                Model.hasMany(models.Account, {foreignKey: 'companyId', as: 'accounts'})
	};

	return Model;
};
