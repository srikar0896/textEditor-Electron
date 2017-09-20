$(function () {

	var os = require('os');
	var fs = require('fs');
	var app = require('electron').remote;
	var dialog = app.dialog;

  // DOM elements initialization
  var textInput = $(".textInput");

  openFile = function(){
    dialog.showOpenDialog(function (fileNames) {

    if (fileNames === undefined) return;

      var fileName = fileNames[0];

        fs.readFile(fileName, 'utf-8', function (err, data) {
			       currentFilePath = fileName;
			       textInput.val(data);

             //TODO:implement the top nav foldername,filename and filesize.
  	  });
  	 });
    };

    saveFile = function(){
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
              file.writeFile(savePath, content, (error) => {
                  if (error) console.log('File not saved; ' + error);
                  console.log('File saved at ' + savePath);
                  
                  //TODO:implement the top nav foldername,filename and filesize.
              });
          });
      }
    };

});
