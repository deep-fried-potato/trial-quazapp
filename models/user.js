module.exports = function(sequelize,DataTypes){
  var User = sequelize.define("User",{
    userid:{type: DataTypes.STRING, primaryKey:true},
    name: {type:DataTypes.STRING},
    age:{type:DataTypes.INTEGER}
  });
  User.associate = function(models){
    models.User.hasMany(models.Response)
  };

  return User;
};
