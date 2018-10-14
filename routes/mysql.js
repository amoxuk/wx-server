var express = require('express');
var router = express.Router();
var moment = require("moment")

var db = require("../config/db");

/**
 * 查询列表页
 */
router.get("/", function (req, res, next) {
  db.query("select * from memoirs", function (err, rows) {
    if (err) {
      res.render("mysql", { title: "用户列表", datas: [] });
    } else {
      res.render("mysql", { title: "用户列表", datas: rows });
    }
  });
});

// /**
//  * 添加用户
//  */
// router.get("/add", function (req, res, next) {
//   res.render("add");
// });
router.post("/", function (req, res, next) {
  var name = req.body.nickName;
  var age = req.body.title;
  var content = req.body.content;
  var location = req.body.location;
  var creatTime = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query("insert into memoirs(username,title,content,location,creat_time) values('" + name + "','" + age + "','" + content + "','" + location + "','" + creatTime + "')", function (err, rows) {
    if (err) {
      res.send("新增失败" + err);
    } else {
      //res.redirect("/mysql");
    }
    db.query("select * from memoirs", function (err, rows) {
      if (err) {
        res.send({ title: "用户列表", datas: [] });
      } else {
        res.send({ title: "用户列表", datas: rows });
      }
    });
  });
});

/**
 * 删除用户
 */
router.get("/del/:id", function (req, res) {
  var id = req.params.id;
  db.query("delete from memoirs where id = " + id, function (err, rows) {
    if (err) {
      res.send("删除失败" + err);
    } else {
      res.redirect("/mysql");
    }
  });
});

/**
 * 修改
 */
router.get("/toUpdate/:id", function (req, res, next) {
  var id = req.params.id;
  var sql = "select * from memoirs where id = " + id;
  console.log(sql);
  db.query(sql, function (err, rows) {
    if (err) {
      res.send("修改页面跳转失败");
    } else {
      res.render("update", { datas: rows });
    }
  });
});

router.post("/update", function (req, res, next) {
  var id = req.body.id;
  var name = req.body.username;
  var age = req.body.title;
  var sql = "update memoirs set username = '" + name + "',title = '" + age + "' where id = " + id;
  console.log(sql);
  db.query(sql, function (err, rows) {
    if (err) {
      res.send("修改失败 " + err);
    } else {
      res.redirect("/mysql");
    }
  });
});


/**
 * 查询
 */
router.post("/search", function (req, res, next) {
  var username = req.body.username;
  var title = req.body.title;
  var sql = "select * from memoirs";
  if (username) {
    sql += " where username = '" + username + "'";
  }
  if (title) {
    sql += " and title = '" + title + "'";
  }

  sql.replace("and", "where");
  db.query(sql, function (err, rows) {
    if (err) {
      res.send("查询失败: " + err);
    } else {
      res.render("mysql", { title: "用户列表", datas: rows, username: username, title: title });
    }
  });
})

module.exports = router;