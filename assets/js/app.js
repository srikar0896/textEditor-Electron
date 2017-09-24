$(function () {

	var os = require('os');
	var fs = require('fs');
	var app = require('electron').remote;
	var dialog = app.dialog;

  // DOM elements initialization
  var textInput = $(".textInput");

	 var currentFile = null;

   formatBytes = function(bytes, decimals){
    if (bytes == 0) return '0 Bytes';
    var k = 1024,
        dm = decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
   }

  updateFields = function(){
    var stats = file.statSync(currentFile);
    var fileSize = formatBytes(stats.size);
    $("#fiSize").html(fileSize);
    var splitPath = currentFile.split("\\");
    $("#fiName").html(splitPath[splitPath.length - 1]);
    $("#foName").html(splitPath[splitPath.length - 2]);
    $('title').html(splitPath[splitPath.length - 1]);
  }

  openFile = function(){
    dialog.showOpenDialog(function (fileNames) {

    if (fileNames === undefined) return;

      var fileName = fileNames[0];

        fs.readFile(fileName, 'utf-8', function (err, data) {
			       currentFile = fileName;
			       textInput.val(data);
             updateFields();
  	  });
  	 });
    };

    saveAsNewFile = function(){
      var content = $("#text").val();
      var check = content.replace(/ /g, '');
      if (check === '') {
          dialog.showErrorBox('Cannot Continue!', 'Please write something in the textarea to save');
      } else {
          dialog.showSaveDialog((savePath) => {
              if (savePath === undefined) {
                  console.log("Error in detecting the path to save the file");
                  return;
              }
              fs.writeFile(savePath, content, (error) => {
                  if (error) console.log('File not saved; ' + error);
                  console.log('File saved at ' + savePath);
									currentFile = savePath;
                  updateFields();
              });
          });
      }
    };

		saveFile = function(){
		    if(currentFile === null) {
		        saveAsNewFile();
		    }
		    else {
		        var content = $("#text").val();
		        fs.writeFile(currentFile, content, (error) => {
		            if (error) console.log('File not saved; ' + error);
		            console.log('File saved at ' + currentFile);
								updateFields();
		        });
		    }
		};

    newFile = function(){
      $("#text").val('');
      $("#foName").html('Folder Name');
      $("#fiName").html('File Name');
      $("#fiSize").html('File Size');
      currentFile = null;
    }

});
