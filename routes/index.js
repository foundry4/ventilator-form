const express = require('express');
const router = express.Router();
const { Client } = require('pg');
const createData = require('../lib/createData');


// GET home page
router.get('/', function (req, res, next) {
  res.render("simpleForm", {});
});

// test macros
router.get('/test', function (req, res, next) {
  res.render("macroTest", {});
});


router.post('/submit', function (req, res, next) {
  try {
    var data = req.body;
    const { fields, positions, json, values } = createData(data);
    var sql = "INSERT INTO responses(" + fields + ") VALUES (" + positions + ");"
    const query = {
      text: sql,
      values: values
    }
    console.log(req.app.get('env') );
    console.log("ssl?" + (process.env.NODE_ENV === 'production'));

    try {

      const client = new Client({
        connectionString: process.env.HEROKU_POSTGRESQL_RED_URL || process.env.DATABASE_URL,
        ssl: (process.env.NODE_ENV === 'production'),
      });
      

      client.connect();

      client.query(query, (err, response) => {

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
