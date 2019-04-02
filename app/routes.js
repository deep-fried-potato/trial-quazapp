module.exports = function(app,models){
  app.get("/listquizzes",(req,res)=>{
    // models.quiz.findAll({
    //   attributes:["quizid"]
    // }).then((result)=>{
    //   res.json(result)
    // })
    models.sequelize.query('SELECT "quizid" FROM "quizzes" AS "quiz"').then(([result,metadata])=>{
      res.json(result)
    })
  })
  app.get("/getquiz/:id",(req,res)=>{
    // models.quiz.findOne({
    //   where:{
    //     quizid:req.params.id
    //   }
    // }).then(result=>{
    //   res.json(result);
    // }).catch(function(err){
    //   if(err.errors) res.json(err.errors[0].message);
    // })
    sql= 'SELECT "quizid", "accesskey", "qdata", "starttime", "endtime", "createdAt", "updatedAt" FROM "quizzes" AS "quiz" WHERE "quiz"."quizid" =\''+req.params.id +'\' '
    models.sequelize.query(sql).then(([result,metadata])=>{
      res.json(result)
    })
  })

  app.post("/createquiz",(req,res)=>{
    // models.quiz.create({
    //   quizid:req.body.quizid,
    //   accesskey:req.body.accesskey,
    //   qdata:req.body.qdata,
    //   starttime:req.body.starttime,
    //   endtime:req.body.endtime,
    // }).then(function(result){
    //   res.json(result)
    // }).catch(function(err){
    //   if(err.errors) res.json(err.errors[0].message);
    // })
    qdata = JSON.stringify(req.body.qdata)
    console.log(date)
    date = new Date()
    date = date.toJSON()
    sql='INSERT INTO "quizzes" ("quizid","accesskey","qdata","starttime","endtime","createdAt","updatedAt") VALUES (\''+req.body.quizid+'\',\''+req.body.accesskey+'\',\''+qdata+'\',\''+req.body.starttime+'\',\''+req.body.endtime+'\',\''+date+'\',\''+date+'\' ) RETURNING *'
    models.sequelize.query(sql).then(([result,metadata])=>{
      res.json(result)
    }).catch((err)=>{
      res.json("There has been an error")
    })
  })
  app.post("/createUser",(req,res)=>{
    // models.User.create({
    //   userid:req.body.userid,
    //   name:req.body.name,
    //   age:req.body.age
    // }).then(function(result){
    //   res.json(result)
    // }).catch(function(err){
    //   if(err.errors) res.json(err.errors[0].message);
    // })
    date = new Date()
    date = date.toJSON()
    sql='INSERT INTO "Users" ("userid","name","age","createdAt","updatedAt") VALUES (\''+req.body.userid+'\',\''+req.body.name+'\','+req.body.age+',\''+date+'\',\''+date+'\') RETURNING *'
    models.sequelize.query(sql).then(([result,metadata])=>{
      res.json(result)
    }).catch((err)=>{
      res.json("There has been an error")
    })
  })
  app.post("/getResponses",(req,res)=>{
    //User verification
    //Group verification
    // models.Response.findAll({
    //   where:{
    //     UserUserid:req.body.userid,
    //     quizQuizid:req.body.quizid
    //   }
    // }).then((result)=>{
    //   res.json(result)
    // })
    sql='SELECT "id", "response", "createdAt", "updatedAt", "quizQuizid", "UserUserid" FROM "Responses" AS "Response" WHERE "Response"."UserUserid" = \''+req.body.userid+'\' AND "Response"."quizQuizid" =\''+req.body.quizid+'\''
    models.sequelize.query(sql).then(([result,metadata])=>{
      res.json(result)
    }).catch((err)=>{
      res.json("There has been an error")
    })
  })

  app.post("/startquiz",(req,res)=>{
    // User verification
    // Group verification
    // models.Response.create({
    //   UserUserid:req.body.userid,
    //   quizQuizid:req.body.quizid,
    //   response:[]
    // }).then((result)=>{
    //   res,json(result)
    // })
    date = new Date()
    date = date.toJSON()
    sql='INSERT INTO "Responses" ("response","createdAt","updatedAt","quizQuizid","UserUserid") SELECT  \'[]\', \''+date+'\', \''+date+'\', \''+req.body.quizid+'\', \''+req.body.userid+'\' WHERE NOT EXISTS ( SELECT 1 FROM "Responses" WHERE "UserUserid"=\''+req.body.userid+'\' AND "quizQuizid"=\''+req.body.quizid+'\' ) RETURNING *'
    models.sequelize.query(sql).then(([result,metadata])=>{
      res.json(result)
    }).catch((err)=>{
      console.log(err)
      res.json("There has been an error")
    })
  })
  app.post("/sendAnswer",(req,res)=>{
    //User verification
    //Group verification

    // models.Response.findOrCreate({
    //   where:{
    //     UserUserid:req.body.userid,
    //     quizQuizid:req.body.quizid,
    //   },
    //   defaults:{
    //       response:[]
    //   }
    // }).then(([resp,created])=>{
    //   resp.response[req.body.question] = req.body.answer;
    //   resp.update({response:resp.response}).then(result=>{
    //     res.json(result)
    //   }).catch(err=>{res.json("response pattern incorrect")})
    // }).catch(err=>{res.json("Use correct values")})
    sql='SELECT * FROM "Responses" AS "Response" WHERE "Response"."UserUserid"=\''+req.body.userid+'\' AND "Response"."quizQuizid"=\''+req.body.quizid+'\''
    models.sequelize.query(sql).then(([result,metadata])=>{
      id=result[0].id
      response = result[0].response
      response[req.body.question] = req.body.answer
      response = JSON.stringify(response)
      date = new Date()
      date = date.toJSON()
      sql='UPDATE "Responses" SET "response"=\''+response+'\', "updatedAt"=\''+date+'\' WHERE "id"='+id+' RETURNING *'
      models.sequelize.query(sql).then(([result,metadata])=>{
        res.json(result)
      }).catch((err)=>{
        console.log(err)
        res.json("There has been an error")
      })
    }).catch((err)=>{
      console.log(err)
      res.json("There has been an error")
    })
  })
}
