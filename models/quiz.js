module.exports = function(sequelize,DataTypes){
  var quiz = sequelize.define("quiz",{
    quizid:{type:DataTypes.STRING, primaryKey:true},
    accesskey:{type:DataTypes.STRING},
    qdata:{type:DataTypes.JSONB},
    starttime:{type:DataTypes.DATE,validate:{isDate:true}},
    endtime:{type:DataTypes.DATE,validate:{isDate:true}},
  });
  quiz.associate = function(models){
    models.quiz.hasMany(models.Response)
  };

  return quiz;
}
