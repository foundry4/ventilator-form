var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {});
});

router.post('/submit', function (req, res, next) {

  //try {
    var data = req.body;
    var contact_name = data['contact_name'] || "";
    var contact_phone = data['contact_phone'] || "";
    var contact_email = data['contact_email'] || "";
    var json = JSON.stringify(data);

    // loop through results
    var keys = Object.keys(data);
    var len = keys.length;
    for (var i = 0; i < len; i++) {
      console.log(keys[i], data[keys[i]]);
    }

    var sql_values = {
      "info": json,
      "contact_name": contact_name,
      "contact_phone": contact_phone,
      "contact_email": contact_email
    }

    // Build arrays of entries for the SQL query
    var fieldNames = [];
    var valuePositions = [];
    var values = [];
    var sql_keys = Object.keys(sql_values)
    for (var i = 0; i < sql_keys.length; i++) {
      key = sql_keys[i]
      fieldNames.push(key)
      valuePositions.push("$" + (i + 1))
      values.push(sql_values[key])
    }

    var fields = fieldNames.join(", ");
    var positions = valuePositions.join(", ");

    var sql = "INSERT INTO reponses(" + fields + ") VALUES (" + positions + ");"
    console.log(sql);
    const query = {
      text: sql,
      values: values
    }

    console.log(query);
    //try {

      const client = new Client({
        connectionString: process.env.HEROKU_POSTGRESQL_RED_URL || process.env.DATABASE_URL,
        ssl: true,
      });

      console.log("connect");
      client.connect();

      client.query(query, (err, res) => {
        console.log(res);

        client.end();
        if (err) next(err);
      });

      res.render("confirm", {});
/*
     }
    catch (err) {
      throw new err('Failed to connect to database')
    }
 */

    //res.render("confirm", {});
/*   }
  catch{
    //console.log("catch");
    throw new err('Failed to connect to database')
  } */


});

module.exports = router;
