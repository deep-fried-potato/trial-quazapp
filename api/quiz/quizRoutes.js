let express = require('express')
let router = express.Router()

router.get("/getTest/:id", (req, res) => {
  models.Test.findOne({
    where: {
      testid: req.params.id
    }
  }).then(result => {
    res.json(result);
  }).catch(function (err) {
    if (err.errors) res.json(err.errors[0].message);
  })
})

router.post("/createTest", (req, res) => {
  models.Test.create({
    testid: req.body.testid,
    accesskey: req.body.accesskey,
    qdata: req.body.qdata,
    starttime: req.body.starttime,
    endtime: req.body.endtime,
  }).then(function (result) {
    res.json(result)
  }).catch(function (err) {
    if (err.errors) res.json(err.errors[0].message);
  })
})
router.post("/createUser", (req, res) => {
  models.User.create({
    userid: req.body.userid,
    name: req.body.name,
    age: req.body.age
  }).then(function (result) {
    res.json(result)
  }).catch(function (err) {
    if (err.errors) res.json(err.errors[0].message);
  })
})
router.post("/getResponses", (req, res) => {
  //User verification
  //Group verification
  models.Response.find({
    where: {
      UserUserid: req.body.userid,
      TestTestid: req.body.testid
    }
  })
})
router.post("/sendAnswer", (req, res) => {
  //User verification
  //Group verification
  models.User.findOne({ where: { userid: req.body.userid } }).then(user => {
    models.Test.findOne({ where: { testid: req.body.testid } }).then(test => {
      models.Response.findOrCreate({
        where: {
          UserUserid: user.userid,
          TestTestid: test.testid,
        },
        defaults: {
          response: []
        }
      }).then(([resp, created]) => {
        resp.response[req.body.question] = req.body.answer;
        resp.update({ response: resp.response }).then(result => {
          res.json(result)
        }).catch(err => { res.json("response pattern incorrect") })
      }).catch(err => { res.json("Use correct values") })
    }).catch(err => { console.log(err); res.json("Use correct testid") })
  }).catch(err => { res.json("Use correct userid") })
})

module.exports = router