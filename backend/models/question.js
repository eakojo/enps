
module.exports = (sequelize, DataTypes) => {
	const Model = sequelize.define('Question', {
        question: {type: DataTypes.STRING},
        type: {type: DataTypes.STRING},
        hearer: {type: DataTypes.STRING}
	});

	Model.associate = function(models) {
        Model.hasMany(models.Answer, {foreignKey: 'questionId', as: 'answers'})
    };

    return Model;
};
