var path = require('path');
var fs = require('fs');
var Cloudant = require('cloudant');


//var process = require('process');

function Persistency(username, password, database) {
	var cloudant = Cloudant({account:username, password:password});
	var dbname = database;
	var db = cloudant.db.use(dbname);;
    var doc = null;

    return  {

   		"listDBs" : function(callback) {
   			console.log('list db function invoked');
			cloudant.db.list(function(err, data) {
			  if (err) throw err;
			  console.log('All my databases: %s', data.join(', '));
			  callback(err, data);
			});
		},

		"getDB" : function(callback) {
			cloudant.db.get(dbname, function(err, data) {
				callback(err, data);
		  	});
		},

		"createDatabase" : function(callback) {
		  console.log("Creating database '" + dbname  + "'");
		  cloudant.db.create(dbname, function(err, data) {
			  	if (err)
			    	console.log("Error:", err);
			    console.log("Data: ", data);
			    db = cloudant.db.use(dbname);
			    console.log('passou aqui');
			    callback(err, data);
			});
		  
		},

		// create a document
		"createDocument" : function(objDoc, callback) {
		    console.log("Creating document");
		    // we are specifying the id of the document so we can update and delete it later
		    db.get(objDoc._id, { revs_info: true }, function(err, data) {
			  if (!err) {
			  	 objDoc._rev = data._rev;
			     db.insert(objDoc, function(err, data) {
				  	if (err)
				    	console.log("Error:", err);
				    console.log("Data:", data);
				    callback(err, data);
				 });
			  } else {
			  	db.insert(objDoc, function(err, data) {
				  	if (err)
				    	console.log("Error:", err);
				    console.log("Data:", data);
				    callback(err, data);
				 });
			  }
		    });
		 
		},

		"insertDocWithAttachments" : function(objDoc, objAttachment, callback) {
			db.multipart.insert(objDoc, objAttachment, objDoc._id, function(err, data) {
			    if (!err)
			      console.log(data);
			  	callback(err, data);
			});
		},

		"readDocWithAttachments" : function(objDoc, callback) {
			db.attachment.get(objDoc._id, objDoc.name, function(err, data) {
			  if (!data) console.log('nenhum doc encontrado');

			  //console.log(data);
			  //   fs.writeFile('icon_teste.png', data);
			  // }
			  callback(err, data);
			});
		},

		"listDocs" : function(callback) {
			db.list(function(err, data) {
			  if (!err) {
			    data.rows.forEach(function(doc) {
			      console.log(doc);

			    }); 
			  }
			  callback(err, data);
			});
		},

		"readDocument" :  function(objDoc, callback) {
		  console.log("Reading document %s", JSON.stringify(objDoc));
		  db.get(objDoc.id, function(err, data) {
		  	if (err) 
		    	console.log("Error:", err);
		    //console.log("Data:", data);
		    // keep a copy of the doc so we know its revision token
		    
		    callback(err, data);
		  });
		},

		// deleting a document
		"deleteDocument" : function(objDoc, callback) {
		  console.log("Deleting document 'mydoc'");
		  // supply the id and revision to be deleted
		  db.destroy(objDoc._id, objDoc._rev, function(err, data) {
		    console.log("Error:", err);
		    console.log("Data:", data);
		    callback(err, data);
		  });
		},

		// deleting the database document
		"deleteDatabase" : function(callback) {
		  console.log("Creating database '" + dbname  + "'");
		  cloudant.db.destroy(dbname, function(err, data) {
		    console.log("Error:", err);
		    console.log("Data:", data);
		    callback(err, data);
		  });
		},

		"insertAttachmentsFromDirectory" : function(obj, directoryName, contentTypeOfFiles) {
			console.log("Directory name [%s]", directoryName);
			fs.readdir(directoryName, function (err, files) {
				if (err)
					console.log('ERROR %s', err);
				
				files.forEach( function(fileName) {
					var newFileName = directoryName + '/'+fileName;
					console.log('Reading file: [%s]', newFileName);
					fs.readFile(newFileName, function(err, contentFile) {
						//objFuncionario._id = fileName;
						//console.log(fileName + '=' + contentFile);
						var imgBase64 = contentFile.toString('base64');
						//console.log(imgBase64);
						var objAttachment = [{name: fileName, data: imgBase64, content_type: contentTypeOfFiles}];
						
						this.insertDocWithAttachments(obj, objAttachment, function(err, data) {
							if (err) 
								console.log(err);			
							//console.log(data);
						});
					});
				});
			});
		}

   }
}


module.exports = Persistency; 


