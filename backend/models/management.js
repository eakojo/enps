
module.exports = (sequelize, DataTypes) => {
	const Model = sequelize.define('Management', {
        firstname:  {type: DataTypes.STRING},
        lastname: {type: DataTypes.STRING},
        phone: {type: DataTypes.STRING},
        title: {type: DataTypes.STRING},
        avatar: {type: DataTypes.STRING},
        active:{type: DataTypes.BOOLEAN}
	});

	Model.associate = function(models) {
          Model.belongsTo(models.Account, {foreignKey: 'accountId', as: 'user'})
	};

    Model.prototype.fullname = async function (){
       if(this.middlename){
            return this.firstname+' '+this.middlename+' '+this.lastname
       }else{
            return this.firstname+' '+this.lastname
       } 
    }
	return Model;
};