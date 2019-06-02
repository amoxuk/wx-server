var express = require('express');
var wechat = require('wechat');
var router = express.Router();
var config = {
    "appID": "wx9964adbcb6c21bd9",
    "appsecret": "91687f6314257936c98269113e3ed2df",
    "token": "950815x"
}
 
router.use(express.query());
 
router.use('/', wechat(config, function(req, res, next) {
	console.log(req.weixin);
	var message = req.weixin;
	//文本
	if (message.Content === '爱') {
		res.reply('我最爱我家晶晶~~~');
	}else{
        res.reply(message.Content);
    }
}));
 
module.exports = router;
