module.exports = function(sequelize,DataTypes){
  var Response = sequelize.define("Response",{
    response:{type:DataTypes.JSONB},
  });

  Response.associate = function (models) {
    models.Response.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  Response.associate = function (models) {
    models.Response.belongsTo(models.Test, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Response
};
