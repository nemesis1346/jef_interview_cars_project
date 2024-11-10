console.log('Entering in routes')
const express = require("express");
const router = express.Router();

const marcoUserRoute = require("./marcoUserRoute");

router.route("/api/marco_user", marcoUserRoute);


module.exports = router;
