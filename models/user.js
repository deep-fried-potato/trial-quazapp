module.exports = function (sequelize, DataTypes) {

  var User = sequelize.define("User", {
    userid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: { type: DataTypes.STRING },
    age: { type: DataTypes.INTEGER },
  });

  User.associate = (models) => {
    //  models.User.hasOne(models.Student)
    //  models.User.hasOne(models.Teacher)
  }

  return User;
};
