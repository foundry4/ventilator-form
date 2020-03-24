# express
Sample express form highlighting how to create a boilerplate form using the govUk frontend toolkit based on [passport details](https://github.com/alphagov/govuk-frontend/tree/master/app/views/full-page-examples/passport-details).

# Key endpoints

##  Get /full-form

The endpoint showing the view for the form

##  Post /full-form

The endpoint handling submission of the form

### Key points

This route begins by checking for any validation errors 

# Key files

## routes/index.js

This is the file handling the main routes

## lib/save_to_db.js

This is the file processing the JSON data from the form. It calls teh createMacroData function to process the JSON response into valid entries that we can use to build the sql query.

It then generates the sql query and then sends the query to the database. 

## lib/createMacroData.js

This file receives the JSON response from the form and converts the json into the valid columns it needs to make it usable.

This function can then be reused to convert the json to the columsn for any entries that do not have the columns yet.

## lib/utils.js

This file provides helper functions to allow us to handle errors more easily.

## views/full-form.html

This file renders the view for the form using the gov toolkit and displays errors as needed

## macroDatabase.sql

This is the sql query to create the backend sql database for us to use with the necessary columns.