const express = require('express');
const router = express.Router();
const { Client } = require('pg');
const createData = require('../lib/createData');
var { devices, expertise, resources } = require('../lib/constants');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {});
});


router.post('/submit', function (req, res, next) {
  try {
    var data = req.body;
    const { fields, positions, json, values } = createData(data);
    var sql = "INSERT INTO companies(" + fields + ") VALUES (" + positions + ");"
    const query = {
      text: sql,
      values: values
    }

    console.log(query);

    try {

      const client = new Client({
        connectionString: process.env.HEROKU_POSTGRESQL_RED_URL || process.env.DATABASE_URL,
        ssl: true,
      });

      client.connect();

      client.query(query, (err, res) => {

        client.end();
        if (err) {
          next(err)
        } else {
          res.render("confirm", {});
        }
      });

    }
    catch (err) {
      throw new err('Failed to connect to database')
    }

  }
  catch{
    throw new err('Failed to connect to database')
  }


});

module.exports = router;
