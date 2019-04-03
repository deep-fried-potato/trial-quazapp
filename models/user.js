module.exports = function (sequelize, DataTypes) {

  var User = sequelize.define("User", {
    userid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: { type: DataTypes.STRING },
    email: { type:DataTypes.STRING },
    password: {type:DataTypes.STRING },
    age: { type: DataTypes.INTEGER },
    isTeacher: { type: DataTypes.BOOLEAN }
  });

  User.associate = (models) => {
    models.User.hasOne(models.Student)
    models.User.hasOne(models.Teacher)
  }

  return User;
};
