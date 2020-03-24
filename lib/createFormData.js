module.exports = (data)=>{
  try {
    var { devices, expertise } = require('../lib/constants');
    // pullout specific BASIC vars
    var companyName = data['organisation-name'] || "";
    var companyNumber = data['company-number'] || "";
    var contact = data['primary-contact'] || "";
    var role = data['primary-contact-role'] || "";
    var phone = data['phone'] || "";
    var email = data['email'] || "";
    console.log("form from " + companyName);

    // SUPPLY CHAIN
    var isClinical = data['is-clinical'] || "no";
    var isHumanUse = data['human-use'] || "no";
    var isVetUse = data['vet-use'] || "no";
    var isOtherUse = data['other-use'] || "no";
    // freetext
    var ventilatorText = data['ventilator-detail'] || "";

    // test checkbox results to ensure they are arrays
    // no results : undefined; single result: string; multiple results: array
    // catch single items and turn into array
    var boxList = ["design", "manufacture", "supply", "skills", "specialism", "resources"];
    for (var i = 0; i < boxList.length; i++) {
      //console.log("-------");
      //console.log(boxList[i]);

      var typeName = boxList[i];
      //console.log(data[typeName]);
      if (data[typeName] && !Array.isArray(data[typeName])) {
        data[typeName] = [data[typeName]];
      }
      //console.log(data[typeName]);
    }

    // MEDICAL DEVICES
    var med_devices = {};
    // loop thru design
    if (data['design'] && data['design'] != undefined) {
      let len = data['design'].length;
      for (var i = 0; i < len; i++) {
        //convert name to string
        var name = data['design'][i].split(" /")[0];
        name = name.split("(")[0];
        name = name.split(",")[0];
        name = name.split(" and")[0];
        name = name.split("-").join("_");
        name = name.split(" ").join("_") + "_design";
        name = name.split("__").join("_").toLowerCase();
        med_devices[name] = "yes";
      }
    }
    if (data['manufacture'] && data['manufacture'] != undefined) {
      let len = data['manufacture'].length;
      for (var i = 0; i < len; i++) {
        //convert name to string
        var name = data['manufacture'][i].split(" /")[0];
        name = name.split("(")[0];
        name = name.split(",")[0];
        name = name.split(" and")[0];
        name = name.split("-").join("_");
        name = name.split(" ").join("_") + "_manufacture";
        name = name.split("__").join("_").toLowerCase();
        med_devices[name] = "yes";
      }
    }
    if (data['supply'] && data['supply'] != undefined) {
      let len = data['supply'].length;
      for (var i = 0; i < len; i++) {
        //convert name to string
        var name = data['supply'][i].split(" /")[0];
        name = name.split("(")[0];
        name = name.split(",")[0];
        name = name.split(" and")[0];
        name = name.split("-").join("_");
        name = name.split(" ").join("_") + "_supply";
        name = name.split("__").join("_").toLowerCase();
        med_devices[name] = "yes";
      }
    }
    // get locations
    for (var i = 1; i < 21; i++) {
      var ref = 0;
      if (data['location-' + i] !== "") {
        var name = devices[i - 1].split("/")[0];
        name = name.split("(")[0];
        name = name.split(",")[0];
        name = name.split(" and")[0];
        name = name.split("-").join("_");
        name = name.split(" ").join("_") + "_location";
        name = name.split("__").join("_").toLowerCase();
        ref = parseInt(data['location-' + i]);
        med_devices[name] = ref;
      }

    }
    //console.log(med_devices);
    
    // Q5
    // freetext
    var offerText = data['offer'] || "";
    
    // SKILLS and SPECIALISM
    var cats = {};
    // loop thru skill
    //console.log("loop though SKILLS");
    if (data['skills'] && data['skills'] != undefined) {
      let len = data['skills'].length;
      for (var i = 0; i < len; i++) {
        var name = data['skills'][i] + "_skills";
        cats[name] = "yes";
      }
    }
    
    //var specialism = [];
    if (data['specialism'] && data['specialism'] != undefined) {
      let len = data['specialism'].length;
      for (var i = 0; i < len; i++) {
        var name = data['specialism'][i] + "_specialism";
        cats[name] = "yes";
      }
    }
    
    // get locations
    for (var i = 1; i < 11; i++) {
      var ref = 0;
      if (data['specialism-location-' + i] !== "") {
        var name = expertise[i - 1].name + "_location";
        ref = parseInt(data['specialism-location-' + i]);
        cats[name] = ref;
      }

    }
    //console.log( "resources:" + data['resources']);

    // Q7
    var resources = [];
    var resources_space = "";
    var resources_equipment = "";
    var resources_personnel = "";
    var resources_other = "";
    if (data['resources'] && data['resources'] != undefined) {
      console.log(data['resources']);
      let len = data['resources'].length;
      for (var i = 0; i < len; i++) {
        console.log(data['resources'][i]);
        if (data['resources'][i] === "Suitable space") {
          resources_space = "yes";
        }
        if (data['resources'][i] === "Equipment") {
          resources_equipment = "yes";
        }
        if (data['resources'][i] === "Trained personnel") {
          resources_personnel = "yes";
        }
        if (data['resources'][i] === "Other") {
          resources_other = "yes";
        }

      }
    }
    // freetext
    var resourcesText = data['resources-detail'] || "";
    //console.log(resources, resourcesText);

    var deviceFields = "";
    var devicesResults = "";
    for (item in med_devices) {
      deviceFields += item + ", ";
    }
    for (item in med_devices) {
      devicesResults += "'" + med_devices[item] + "', ";
    }

    var json = JSON.stringify(data);
    var sql_values = {
      "info": json,
      "company_name": companyName,
      "company_number": companyNumber,
      "contact_name": contact,
      "contact_role": role,
      "contact_phone": phone,
      "contact_email": email,
      "ventilator_production": isClinical,
      "ventilator_parts_human": isHumanUse,
      "ventilator_parts_veterinary": isVetUse,
      "ventilator_parts_any": isOtherUse,
      "ventilator_parts_details": ventilatorText,
      "offer_organisation": offerText,
      "resources_space": resources_space,
      "resources_equipment": resources_equipment,
      "resources_personnel": resources_personnel,
      "resources_other": resources_other,
      "resource_details": resourcesText
    }

    // Add in fields from med_devices
    var med_keys = Object.keys(med_devices)
    for (var i = 0; i < med_keys.length; i++) {
      key = med_keys[i]
      sql_values[key] = med_devices[key]
    }

    // Add in fields from cats
    var cat_keys = Object.keys(cats)
    for (var i = 0; i < cat_keys.length; i++) {
      key = cat_keys[i]
      sql_values[key] = cats[key]
    }

    // Quick check
    //console.log("SQL values: " + sql_values)

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
    return { fields, positions, values, json, sql_values };
  }
  catch(err){}
  throw new error('failed to convert json to columns');
}