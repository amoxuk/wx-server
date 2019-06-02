var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
}); 
router.post('/', function (req, res, next) {
  // console.log( req.headers)
  console.log( req.header("User-Agent"))
  // console.log( req.headers)
  // console.log( req.rawHeaders)
  // var header = req.rawHeaders;
  // console.log( header[header.indexOf("User-Agent")+1])

  // do something else 
  
  var rep = decodeURIComponent(req.body.emoji);
  // do something else 
  console.log(rep);
  res.send(rep + "   "+encodeURIComponent(rep));
});

module.exports = router;
