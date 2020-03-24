const express = require('express');
const router = express.Router();
const { Client } = require('pg');

const createMacroData = require('../lib/createMacroData');
const { body, validationResult } = require('express-validator')
const { formatValidationErrors } = require('../lib/utils');
const save_to_db = require('../lib/save_to_db');
const createData = require('../lib/createFormData');
var {devices, expertise, resources} = require('../lib/constants');


// GET home page
router.get('/', function (req, res, next) {
  res.render('index', {
      devices: devices,
      expertise: expertise,
      resources: resources
  });
});


router.post(
    '/full-form',
    [
      body('passport-number')
          .exists()
          .not().isEmpty().withMessage('Enter your passport number'),
      body('expiry-day')
          .exists()
          .not().isEmpty().withMessage('Enter your expiry day'),
      body('expiry-month')
          .exists()
          .not().isEmpty().withMessage('Enter your expiry month'),
      body('expiry-year')
          .exists()
          .not().isEmpty().withMessage('Enter your expiry year')
    ],
    async (request, response) => {
      try {
        console.log(request.body,validationResult(request))
        const errors = formatValidationErrors(validationResult(request))
        console.log('found errors in validation')
        if (!errors) {
          console.log('no errors in validation');
          try {
            await save_to_db(request.body,request);
            return response.render('confirm')
          }
          catch (err){
            console.log('Failed to save to database',err.toString());
            response.render('error', { content : {error: {message: "Internal server error"}}});
          }
        }

        // If any of the date inputs error apply a general error.
        const expiryNamePrefix = 'expiry'
        const expiryErrors = Object.values(errors).filter(error => error.id.includes(expiryNamePrefix + '-'))
        if (expiryErrors) {
          const firstExpiryErrorId = expiryErrors[0].id
          // Get the first error message and merge it into a single error message.
          errors[expiryNamePrefix] = {
            id: expiryNamePrefix,
            href: '#' + firstExpiryErrorId
          }

          // Construct a single error message based on all three error messages.
          errors[expiryNamePrefix].text = 'Enter your expiry '
          if (expiryErrors.length === 3) {
            errors[expiryNamePrefix].text += 'date'
          } else {
            errors[expiryNamePrefix].text += expiryErrors.map(error => error.text.replace('Enter your expiry ', '')).join(' and ')
          }
        }

        let errorSummary = Object.values(errors)
        if (expiryErrors) {
          // Remove all other errors from the summary so we only have one message that links to the expiry input.
          errorSummary = errorSummary.filter(error => !error.id.includes(expiryNamePrefix + '-'))
        }
        response.render('./full-form', {
          errors,
          errorSummary,
          values: request.body // In production this should sanitized.
        });
      } catch (err) {
        throw err.toString();
      }
    }
)

router.get('/full-form', function (req, res, next) {
  res.render("full-form");
});

router.get('/privacy', function (req, res, next) {
  res.render('privacy', {});
});


router.post('/submit', function (req, res, next) {
  try {
    var data = req.body;
    const { fields, positions, json, values } = createData(data);
    var sql = 'INSERT INTO companies(' + fields + ') VALUES (' + positions + ');'
    const query = {
      text: sql,
      values: values
    }
    console.log(query);
    console.log(req.app.get('env') );
    console.log('ssl?' + (process.env.NODE_ENV === 'production'));

    try {

      const client = new Client({
        connectionString: process.env.HEROKU_POSTGRESQL_RED_URL || process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production'
      });
      

      client.connect();

      client.query(query, (err, response) => {

        client.end();
        if (err) {
          next(err)
        } else {
          res.render('confirm', {});
        }
      });
 
    }
    catch (err) {
      throw new err('Failed to submit query to database')
    }

  }
  catch{
    throw new err('Failed to connect to database')
  }

});

module.exports = router;
