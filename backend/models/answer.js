
module.exports = (sequelize, DataTypes) => {
	const Model = sequelize.define('Answer', {
        choice: {type: DataTypes.STRING},
	});

	Model.associate = function(models) {
        Model.belongsTo(models.Employee, {foreignKey: 'employeeId', as: 'employee'}),
        Model.belongsTo(models.Department, {foreignKey: 'departmentId', as: 'department'}),
        Model.belongsTo(models.Question, {foreignKey: 'questionId', as: 'question'})
    };

    return Model;
};
