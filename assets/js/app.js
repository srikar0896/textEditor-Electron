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

});
