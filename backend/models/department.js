
module.exports = (sequelize, DataTypes) => {
	const Model = sequelize.define('Department', {
        name: {type: DataTypes.STRING},
        description:  {type: DataTypes.STRING},
	});

	Model.associate = function(models) {
        Model.belongsTo(models.Company, {foreignKey: 'companyId', as: 'company'})
        Model.hasMany(models.Employee, {foreignKey: 'departmentId', as: 'employees'})
	};

	return Model;
};
