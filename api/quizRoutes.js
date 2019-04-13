let express = require('express')
let token2id = require("../auth/token2id")
module.exports = function (models) {

  let router = express.Router()

  router.get("/listquizzes", (req, res) => {
    // models.quiz.findAll({
    //   attributes:["quizid"]
    // }).then((result)=>{
    //   res.json(result)
    // })
    token2id(req.get("x-access-token")).then((id) => {
      //check if id(Student) is in course or not req.body.cid
      //change SQL command after getting course api
      models.sequelize.query(`SELECT "quizid" FROM "quizzes" AS "quiz"`).then(([result, metadata]) => {
        res.json(result)
      })
    })

  })
  router.get("/getquiz/:quizid", (req, res) => {
    // models.quiz.findOne({
    //   where:{
    //     quizid:req.params.id
    //   }
    // }).then(result=>{
    //   res.json(result);
    // }).catch(function(err){
    //   if(err.errors) res.json(err.errors[0].message);
    // })
    token2id(req.get("x-access-token")).then(async (id) => {
      //check if id(Student) is in course or not quiz.courseCid
      //change SQL command after getting course api
      var cid = await models.sequelize.query(`SELECT "CourseCid" FROM "quizzes" WHERE "quizzes"."quizid"=${req.params.quizid} `)
      sql = `SELECT "quizid", "accesskey", "qdata", "starttime", "endtime", "createdAt", "updatedAt" FROM "quizzes" AS "quiz" WHERE "quiz"."quizid" =${req.params.quizid}`
      models.sequelize.query(sql).then(([result, metadata]) => {
        res.json(result)
      })
    })

  })

  router.post("/createquiz", (req, res) => {
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

    token2id(req.get("x-access-token")).then((id) => {
      // get id and use course middleware to get course id , if both id equal, proceed
      qdata = JSON.stringify(req.body.qdata)
      date = new Date()
      date = date.toJSON()
      sql = 'INSERT INTO "quizzes" ("accesskey","qdata","starttime","endtime","createdAt","updatedAt") VALUES (\'' + req.body.accesskey + '\',\'' + qdata + '\',\'' + req.body.starttime + '\',\'' + req.body.endtime + '\',\'' + date + '\',\'' + date + '\' ) RETURNING *'
      models.sequelize.query(sql).then(([result, metadata]) => {
        res.json(result)
      }).catch((err) => {
        res.json("There has been an error")
      })
    }).catch((err) => {
      console.log("A token error occured")
    })
  })

  // try{
  //     var id = await token2id(req.get("x-access-token"))
  //     console.log(id)
  // }
  // catch{
  //   console.log("Token error")
  // }

  router.post("/createUser", (req, res) => {
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
    sql = `INSERT INTO "Users" ("name","age","createdAt","updatedAt","isTeacher") VALUES ('${req.body.name}',${req.body.age},'${date}','${date}',${req.body.isTeacher}) RETURNING *`
    models.sequelize.query(sql).then(([result, metadata]) => {
      res.json(result)
    }).catch((err) => {
      res.json("There has been an error")
    })
  })
  router.post("/getResponses", (req, res) => {
    //User verification
    //Group verification
    // models.Response.findAll({
    //   where:{
    //     StudentSid:req.body.userid,
    //     quizQuizid:req.body.quizid
    //   }
    // }).then((result)=>{
    //   res.json(result)
    // })
    sql = 'SELECT "id", "response", "createdAt", "updatedAt", "quizQuizid", "StudentSid" FROM "Responses" AS "Response" WHERE "Response"."StudentSid" = ' + req.body.userid + ' AND "Response"."quizQuizid" =\'' + req.body.quizid + '\''
    models.sequelize.query(sql).then(([result, metadata]) => {
      res.json(result)
    }).catch((err) => {
      res.json("There has been an error")
    })
  })

  router.post("/startquiz", (req, res) => {
    // User verification
    // Group verification
    // models.Response.create({
    //   StudentSid:req.body.userid,
    //   quizQuizid:req.body.quizid,
    //   response:[]
    // }).then((result)=>{
    //   res,json(result)
    // })
    date = new Date()
    date = date.toJSON()
    sql = 'INSERT INTO "Responses" ("response","createdAt","updatedAt","quizQuizid","StudentSid") SELECT  \'[]\', \'' + date + '\', \'' + date + '\', \'' + req.body.quizid + '\',' + req.body.userid + ' WHERE NOT EXISTS ( SELECT 1 FROM "Responses" WHERE "StudentSid"=\'' + req.body.userid + '\' AND "quizQuizid"=\'' + req.body.quizid + '\' ) RETURNING *'
    models.sequelize.query(sql).then(([result, metadata]) => {
      res.json(result)
    }).catch((err) => {
      console.log(err)
      res.json("There has been an error")
    })
  })
  router.post("/sendAnswer", (req, res) => {
    //User verification
    //Group verification

    // models.Response.findOrCreate({
    //   where:{
    //     StudentSid:req.body.userid,
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
    sql = 'SELECT * FROM "Responses" AS "Response" WHERE "Response"."StudentSid"= ' + req.body.userid + ' AND "Response"."quizQuizid"=\'' + req.body.quizid + '\''
    models.sequelize.query(sql).then(([result, metadata]) => {
      id = result[0].id
      response = result[0].response
      response[req.body.question] = req.body.answer
      response = JSON.stringify(response)
      date = new Date()
      date = date.toJSON()
      sql = 'UPDATE "Responses" SET "response"=\'' + response + '\', "updatedAt"=\'' + date + '\' WHERE "id"=' + id + ' RETURNING *'
      models.sequelize.query(sql).then(([result, metadata]) => {
        res.json(result)
      }).catch((err) => {
        console.log(err)
        res.json("There has been an error")
      })
    }).catch((err) => {
      console.log(err)
      res.json("There has been an error")
    })
  })

  return router
}
