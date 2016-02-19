/*jslint node:true*/

var dishes = require('./dishes.js');
var persistence = require('../cloudant/cloudant.js');
var fs = require('fs');
var path = require('path');
var dishesArray = [];
var ok = false;

//BEGIN: Cloudant section 
//function to populate the database with the images and dishes data
var initDB = function (callbackGetDishesFromDB) {
  var fileJSON = __dirname + '/../cloudant/cloudant.json';
  fs.readFile(fileJSON, 'utf8', function (err, data) {
    if (err) 
      throw err;
    var objJSON = JSON.parse(data);
  
    var username = objJSON.credentials.username;
    var password = objJSON.credentials.password;
    //dishes is the db name;
    var dbDAO = new persistence(username, password, 'dishes');
    
    dbDAO.getDB(function(err, db) {
      if (!db) {
        dbDAO.createDatabase(function(err, data) {
          dishes.getDishes().forEach (function(dish) {
            var fileName = __dirname + '/../public'+ dish.image;
            console.log('fileName = '+fileName);
            fs.readFile(fileName, function(err, contentFile) {
              var objAttachment = [{name: dish.name, data: contentFile.toString('base64'), content_type: 'image/png'}];
              dish._id = dish.objectId;
              dbDAO.insertDocWithAttachments(dish, objAttachment, function(err, data) {
                if (err) 
                  console.log(err);     
                callbackGetDishesFromDB(dbDAO);
              });
            });
          });
        });
      } else {
        console.log ('Database is already created and populated!');
        callbackGetDishesFromDB(dbDAO);
      }
      
    });
  });
  
}

//function to retrieve dishes from Cloudant
var getDishesFromDB = function (dbDAO) {
  dbDAO.listDocs(function(err, data) {
      if (err) {
          console.log('ERRO: ', err);
      }
      data.rows.forEach(function(doc) {
        dbDAO.readDocument(doc, function (err, data1){
          dbDAO.readDocWithAttachments(data1, function (err, data2) {
              if (err) console.log('ERROR when reading attachments: ', err);
              data1.image = 'data:image/png;base64,' + data2.toString('ascii');
              console.log(data1);
              dishesArray.push(data1);
              ok = true;
          });  
        });
      }); 
      
  });

}

if (!ok) {
  initDB(getDishesFromDB);
}
//END: Cloudant section

// Render the Home page
exports.home = function(req, res) {
   res.render('home');
};

//Added this router passing dishesArray to populate the home page from Cloudant data
exports.home2 = function(req, res) {
    res.render('home2', {listDishes:  dishesArray});
};

// Render the Contact Us page
exports.contact = function(req, res) {
    res.render('contact');
};

// Render menu item page based on item id
exports.getDishById = function(req, res) {

  var dishId = req.params.id;
  var allDishes = dishesArray;//dishes.getDishes();
  var dish = "null";
  
  
  for (var i=0, iLen=allDishes.length; i<iLen; i++) {
        if (allDishes[i].objectId === dishId) {
            dish = allDishes[i];
             break;
        }
   }
   res.render('menu-item', {
        item : dish
    });
};

/*
 * REST API CALLS*
 *
 */
 
// All dishes on the menu
exports.getDishesAPI = function(req, res) {
   //res.json(dishes.getDishes());
   res.json(dishesArray);
};

// Return a dish identified by its ID
exports.getMenuItemAPI = function(req, res) {
    
  var dishId = req.params.id;
  var allDishes = dishesArray;//dishes.getDishes();
  var dish = "null";
  
  
  for (var i=0, iLen=allDishes.length; i<iLen; i++) {
        if (allDishes[i].objectId === dishId) {
            dish = allDishes[i];
             break;
        }
   }
   res.json(dish);
};
