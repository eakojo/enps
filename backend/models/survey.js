
module.exports = (sequelize, DataTypes) => {
	const Model = sequelize.define('Survey', {
                name: {type: DataTypes.STRING},
                expiration:  {type: DataTypes.DATE},
                starting: {type: DataTypes.DATE},
                open:{type: DataTypes.BOOLEAN, defaultValue: false}, 
                closed: {type: DataTypes.BOOLEAN, defaultValue: false},
	});

	Model.associate = function(models) {
                Model.belongsTo(models.Company, {foreignKey: 'companyId', as: 'company'}),
                Model.belongsTo(models.Department, {foreignKey: 'departmentId', as: 'department'}),
                Model.belongsTo(models.Employee, {foreignKey: 'employeeId', as: 'employee'}),
                Model.hasMany(models.Question, {foreignKey: 'surveyId', as: 'questions'})
        };

    return Model;
};
