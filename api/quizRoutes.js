let express = require('express')
let token2id = require("../auth/token2id")
module.exports = function (models) {

  let router = express.Router()

  router.get("/listquizzes", (req, res) => {
    token2id(req.get("x-access-token")).then((id)=>{
        //check if id(Student) is in course or not req.body.cid
        //change SQL command after getting course api
        models.sequelize.query(`SELECT "quizid" FROM "quizzes" AS "quiz"`).then(([result, metadata]) => {
          res.json(result)
        })
    }).catch((err)=>{
      res.status(403).json("Token Error")
    })

  })
  router.get("/getquiz/:quizid", (req, res) => {
    token2id(req.get("x-access-token")).then((id)=>{
        //check if id(Student) is in course or not quiz.courseCid
        //change SQL command after getting course api
        //WAIT FOR COURSE API
        //var cid = await models.sequelize.query(`SELECT "CourseCid" FROM "quizzes" WHERE "quizzes"."quizid"=${req.params.quizid} `)
        sql = `SELECT "quizid", "accesskey", "qdata", "starttime", "endtime", "createdAt", "updatedAt" FROM "quizzes" AS "quiz" WHERE "quiz"."quizid" =${req.params.quizid}`
        models.sequelize.query(sql).then(([result, metadata]) => {
          if(result[0].starttime<new Date()) res.json(result)
          else res.status(403).json("Sorry Test Didnt Start Yet")
        })
    }).catch((err)=>{
      res.json("Token Error")
    })

  })

  router.post("/createquiz",(req, res) => {

    token2id(req.get("x-access-token")).then((id)=>{
      // get id and use course middleware to get course id , if both id equal, proceed
          qdata = JSON.stringify(req.body.qdata)
          date = new Date()
          date = date.toJSON()
          sql = 'INSERT INTO "quizzes" ("accesskey","qdata","starttime","endtime","createdAt","updatedAt") VALUES (\'' + req.body.accesskey + '\',\'' + qdata + '\',\'' + req.body.starttime + '\',\'' + req.body.endtime + '\',\'' + date + '\',\'' + date + '\' ) RETURNING *'
          models.sequelize.query(sql).then(([result, metadata]) => {
            res.json(result)
          }).catch((err) => {
            res.json("Please Check quiz timings")
          })
      }).catch((err)=>{
        res.json("A token error occured")
      })
    })



  router.post("/getResponses", (req, res) => {

    token2id(req.get("x-access-token")).then((id)=>{
        //check if id(Student) is in course or not req.body.cid
        //change SQL command after getting course api
        sql = 'SELECT "id", "response", "createdAt", "updatedAt", "quizQuizid", "StudentSid" FROM "Responses" AS "Response" WHERE "Response"."StudentSid" = '+id+' AND "Response"."quizQuizid" =' + req.body.quizid +''
        models.sequelize.query(sql).then(([result, metadata]) => {
          res.json(result)
        }).catch((err) => {
          res.status(403).json("You havent clicked on start quiz yet")
        })
    }).catch((err)=>{
      res.status(403).json("Token Error")
    })

  })

  router.post("/startquiz", (req, res) => {

    token2id(req.get("x-access-token")).then((id)=>{
        //check if id(Student) is in course or not req.body.cid
        //change SQL command after getting course api
        date = new Date()
        date = date.toJSON()
        sql = 'INSERT INTO "Responses" ("response","createdAt","updatedAt","quizQuizid","StudentSid") SELECT  \'[]\', \'' + date + '\', \'' + date + '\', ' + req.body.quizid + ','+ id +' WHERE NOT EXISTS ( SELECT 1 FROM "Responses" WHERE "StudentSid"=' + id + ' AND "quizQuizid"=' + req.body.quizid + ' ) RETURNING *'
        models.sequelize.query(sql).then(([result, metadata]) => {
          res.json(result)
        }).catch((err) => {
          console.log(err)
          res.status(403).json("This is not the quiz timing")
        })
    }).catch((err)=>{
      res.status(403).json("Token Error")
    })

  })
  router.post("/sendAnswer", (req, res) => {
    
    token2id(req.get("x-access-token")).then((userid)=>{
        //check if id(Student) is in course or not req.body.cid
        //change SQL command after getting course api
        sql = 'SELECT * FROM "Responses" AS "Response" WHERE "Response"."StudentSid"= '+userid+' AND "Response"."quizQuizid"=' + req.body.quizid + ''
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
            res.json("It is not quiz time")
          })
        }).catch((err) => {
          console.log(err)
          res.json("You havent clicked on startquiz")
        })

    }).catch((err)=>{
      res.status(403).json("Token Error")
    })


  })

  return router
}
