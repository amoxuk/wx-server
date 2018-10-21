var express = require('express');
var router = express.Router();
var moment = require("moment");
var db = require("../config/db");

/**
 * 查询列表页
 */
router.get("/", function (req, res, next) {
    var pos = 0;
    var num = 10;
    var sql = "";
    //console.log(req)
    if (req.query.pos && req.query.num) {
        pos = req.query.pos
        num = req.query.num
    }
    if (req.query.key) {
        var key = req.query.key
        sql = "select * from memoirs where INSTR(title,'" + key + "')>0 or INSTR(location,'" + key + "')>0  or INSTR(content,'" + key + "')>0 ORDER by creat_time DESC limit " + pos + "," + num
    } else {
        sql = "select * from memoirs ORDER by creat_time DESC limit " + pos + "," + num
    }
    db.query(sql, function (err, rows) {
        if (err) {
            res.send({ title: "用户列表", datas: [] });
        } else {
            rows.map(item => {
                item.creat_time = moment(item.creat_time).format("YYYY-MM-DD");
                var str = item.location;
                if (str.indexOf('(') > 0) {
                    item.location = str.split('(')[0];
                } else {
                    var n = str.match(/([^省]+自治区|.*?省|.*?行政区|.*?市)([^市]+自治州|.*?地区|.*?行政单位|.+盟|市辖区|.*?市|.*?县|.*?区)(>[^县]+县|.+区|.+市|.+旗|.+海域|.+岛)?([^区]+区|.+镇)?(.*)/);
                    //var pos = item.location.match(/(?[^省]+自治区|.*?省|.*?行政区|.*?市)(?[^市]+自治州|.*?地区|.*?行政单位|.+盟|市辖区|.*?市|.*?县|.*?区)(?[^县]+县|.+区|.+市|.+旗|.+海域|.+岛)?(?[^区]+区|.+镇)?(?.*)/g);
                    try {
                        item.location = n[1] + n[2];
                    } catch (e) {
                        return;
                    }
                }
                //var city = str.match(/[^省]+自治区|.*?省|.*?行政区|.*?市/);
                //console.log(city);
            });
            res.send({ title: "用户列表", datas: rows });

        }
    });
});

/**
 * 添加数据
 */
router.post("/", function (req, res, next) {
    var name = req.body.nickName;
    var title = req.body.title;
    var content = req.body.content;
    var location = req.body.location;
    console.log(req.body)
    for (let param in req.body) {
        if (req.body[param] == null) {
            res.send({ code: 0, msg: "输入参数不能为空" })
            return;
        }
        else if (req.body[param].length < 1) {
            res.send({ code: 0, msg: "输入参数不能为空" })
            return;
        } else if (req.body[param] == 'undefined') {
            res.send({ code: 0, msg: "输入参数不能为空" })
            return;
        }
    }
    //var bsapi = "http://api.map.baidu.com/cloudrgc/v1?location=" + location + "&geotable_id=135675&coord_type=bd09ll&ak=pmhZptbIyuQ1LIa6E1F9VmDaGPdC4Vsw"
    var creatTime = moment().format("YYYY-MM-DD HH:mm:ss");
    db.query("insert into memoirs(username,title,content,location,creat_time) values('" + name + "','" + title + "','" + content + "','" + location + "','" + creatTime + "')", function (err, rows) {
        if (err) {
            res.send({ code: 0, msg: err });
        } else {
            res.send({ code: 1, msg: "发布成功" });
        }
    });
});

/**
 * 删除用户
 */
router.delete("/:id", function (req, res) {
    var id = req.params.id;
    db.query("delete from memoirs where id = " + id, function (err, rows) {
        if (err) {
            res.send({ code: 0, msg: err });
        } else {
            console.log(rows)
            res.send({ code: 1, msg: "删除成功:" + rows.affectedRows });
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
    res.send("查询失败: " + err);
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