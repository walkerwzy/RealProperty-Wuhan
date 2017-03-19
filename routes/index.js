var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});


router.get("/3D", function (req, res, next) {
    res.sendFile([__dirname, "..", "public", "3D.html"].join("/"))
})

module.exports = router;
