var express = require('express');
var router = express.Router();
var moment = require("moment");
var db = require("../config/db");
function tool(section) {
    var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
    var chnUnitChar = ["", "十", "百", "千"];
    return SectionToChinese(section);
    function SectionToChinese(section) {
        var strIns = '', chnStr = '';
        var unitPos = 0;
        var zero = true;
        while (section > 0) {
            var v = section % 10;
            if (v === 0) {
                if (!zero) {
                    zero = true;
                    chnStr = chnNumChar[v] + chnStr;
                }
            } else {
                zero = false;
                strIns = chnNumChar[v];
                strIns += chnUnitChar[unitPos];
                chnStr = strIns + chnStr;
            }
            unitPos++;
            section = Math.floor(section / 10);
        }
        if (chnStr.startsWith("一十")) {
            chnStr = chnStr.substr(1);
        }
        return chnStr;
    }
}

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
        sql = "SELECT memorial.id,memorial.`user`,memorial.title,memorial.memory_time,memorial.remark,memorial.creat_time,memorial.modify_time,DATEDIFF(now(),memorial.memory_time) AS to_annivesary,IF (DATEDIFF(CONCAT(YEAR (NOW()),'-',MONTH (memorial.memory_time),'-',DAY (memorial.memory_time)),now())>= 0,DATEDIFF(CONCAT(YEAR (NOW()),'-',MONTH (memorial.memory_time),'-',DAY (memorial.memory_time)),now()),DATEDIFF(CONCAT(YEAR (DATE_ADD(NOW(),INTERVAL 1 YEAR)),'-',MONTH (memorial.memory_time),'-',DAY (memorial.memory_time)),now())) AS days,IF (DATEDIFF(CONCAT(YEAR (NOW()),'-',MONTH (memorial.memory_time),'-',DAY (memorial.memory_time)),now())>= 0,YEAR (NOW())-YEAR (memorial.memory_time),YEAR (NOW())-YEAR (DATE_ADD(NOW(),INTERVAL 1 YEAR))) AS annivesary FROM memorial WHERE INSTR(title,'" + key + "')> 0 OR INSTR(memory_time,'" + key + "')> 0 ORDER BY days,annivesary ASC LIMIT " + pos + "," + num
        //sql = "select * from memorial where INSTR(title,'" + key + "')>0 or INSTR(remark,'" + key + "')>0  ORDER by memory_time DESC limit " + pos + "," + num
    } else {
        sql = "SELECT memorial.id,memorial.`user`,memorial.title,memorial.memory_time,memorial.remark,memorial.creat_time,memorial.modify_time,DATEDIFF(now(),memorial.memory_time) AS to_annivesary,IF (DATEDIFF(CONCAT(YEAR (NOW()),'-',MONTH (memorial.memory_time),'-',DAY (memorial.memory_time)),now())>= 0,DATEDIFF(CONCAT(YEAR (NOW()),'-',MONTH (memorial.memory_time),'-',DAY (memorial.memory_time)),now()),DATEDIFF(CONCAT(YEAR (DATE_ADD(NOW(),INTERVAL 1 YEAR)),'-',MONTH (memorial.memory_time),'-',DAY (memorial.memory_time)),now())) AS days,IF (DATEDIFF(CONCAT(YEAR (NOW()),'-',MONTH (memorial.memory_time),'-',DAY (memorial.memory_time)),now())>= 0,YEAR (NOW())-YEAR (memorial.memory_time),YEAR (NOW())-YEAR (DATE_ADD(NOW(),INTERVAL 1 YEAR))) AS annivesary FROM memorial ORDER BY days,annivesary ASC LIMIT " + pos + "," + num
    }
    db.query(sql, function (err, rows) {
        if (err) {
            res.send({ error: err });
        } else {
            var tmp;
            rows.map(item => {
                item.creat_time = moment(item.creat_time).format("YYYY-MM-DD");
                item.modify_time = moment(item.modify_time).format("YYYY-MM-DD");
                item.memory_time = moment(item.memory_time).format("YYYY-MM-DD");
                tmp = item.annivesary;
                if (tmp > 0) {
                    tmp = tool(tmp);

                    item.annivesary = tmp + "周年";
                } else {
                    item.annivesary = "";
                }
                //var city = str.match(/[^省]+自治区|.*?省|.*?行政区|.*?市/);
                //console.log(city);
            });
            res.send({ datas: rows });
        }
    });
});

/**
 * 添加数据
 */
router.post("/", function (req, res, next) {
    var name = req.body.user;
    var title = req.body.title;
    var memory = req.body.memory;
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
    var remark = req.body.remark? req.body.remark:"";
    //var bsapi = "http://api.map.baidu.com/cloudrgc/v1?location=" + location + "&geotable_id=135675&coord_type=bd09ll&ak=pmhZptbIyuQ1LIa6E1F9VmDaGPdC4Vsw"
    var creatTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var modifyTime = creatTime;
    db.query(
        "INSERT INTO `wxapp`.`memorial`( `user`, `title`, `memory_time`, `remark`, `creat_time`, `modify_time`) VALUES ('" + name + "', '" + title + "', '" + memory + "', '" + remark + "', '" + creatTime + "', '" + modifyTime + "')"
        , function (err, rows) {
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
