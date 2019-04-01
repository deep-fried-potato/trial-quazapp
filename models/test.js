module.exports = function(sequelize,DataTypes){
  var Test = sequelize.define("Test",{
    testid:{type:DataTypes.STRING, primaryKey:true},
    accesskey:{type:DataTypes.STRING},
    qdata:{type:DataTypes.JSONB},
    starttime:{type:DataTypes.DATE,validate:{isDate:true}},
    endtime:{type:DataTypes.DATE,validate:{isDate:true}},
  });
  Test.associate = function(models){
    models.Test.hasMany(models.Response)
  };

  return Test;
}
