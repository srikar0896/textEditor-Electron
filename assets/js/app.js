$(function() {

    var os = require('os');
    var fs = require('fs');
    var app = require('electron').remote;
    var dialog = app.dialog;

    // DOM elements initialization
    var textInput = $(".textInput");

    var currentFile = null;
    var saveStatus = false;

    formatBytes = function(bytes, decimals) {
        if (bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    updateFields = function() {
        var stats = fs.statSync(currentFile);
        var fileSize = formatBytes(stats.size);
        $("#fiSize").html(fileSize);
        var splitPath = currentFile.split("\\");
        $("#fiName").html(splitPath[splitPath.length - 1]);
        $("#foName").html(splitPath[splitPath.length - 2]);
        $('title').html(splitPath[splitPath.length - 1]);
    };

    openFile = function() {
        if (saveStatus === false) {
            var buttons = ['Save', 'Discard'];
            dialog.showMessageBox({
                type: 'warning',
                buttons: buttons,
                title: 'Unsaved Changes',
                message: 'Some changes made in the file are not saved. Please do the action to continue'
            }, function(response) {
                if (response === 0) {
                    saveFile();
                } else {
                    dialog.showOpenDialog((filePath) => {
                        if (filePath === undefined) {
                            console.log('No file selected');
                        }
                        fs.readFile(filePath[0], 'utf-8', (error, data) => {
                            if (error) console.log('Error in reading the file; ' + error);
                            $("#text").val(data);
                            saveStatus = true;
                            currentFile = filePath[0];
                            updateFields();
                        });
                    });
                }
            });
        } else {
            dialog.showOpenDialog((filePath) => {
                if (filePath === undefined) {
                    console.log('No file selected');
                }
                fs.readFile(filePath[0], 'utf-8', (error, data) => {
                    if (error) console.log('Error in reading the file; ' + error);
                    $("#text").val(data);
                    saveStatus = true;
                    currentFile = filePath[0];
                    updateFields();
                });
            });
        }
    };

    saveAsNewFile = function() {
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
                    saveStatus = true;
                    currentFile = savePath;
                    updateFields();
                });
            });
        }
    };

    saveFile = function() {
        if (currentFile === null) {
            saveAsNewFile();
        } else {
            var content = $("#text").val();
            fs.writeFile(currentFile, content, (error) => {
                if (error) console.log('File not saved; ' + error);
                console.log('File saved at ' + currentFile);
                saveStatus = true;
                updateFields();
            });
        }
    };

    newFile = function() {
        if (saveStatus === false) {
            var buttons = ['Save', 'Discard'];
            dialog.showMessageBox({
                type: 'warning',
                buttons: buttons,
                title: 'Unsaved Changes',
                message: 'Some changes made in the file are not saved. Please do the action to continue'
            }, function(response) {
                if (response === 0) {
                    saveFile();
                } else {
                    $("#text").val('');
                    $("#foName").html('Folder Name');
                    $("#fiName").html('File Name');
                    $("#fiSize").html('File Size');
                    $("#rcount").html('0');
                    currentFile = null;
                }
            });
        } else {
            $("#text").val('');
            $("#foName").html('Folder Name');
            $("#fiName").html('File Name');
            $("#fiSize").html('File Size');
            $("#rcount").html('0');
            currentFile = null;
        }
    };

    var mem = formatBytes(os.freemem());
    $("#osMod").html(os.platform());
    $("#freeMem").html(mem);

    countWords = function(text) {
        var tow = text.match(/\S+/g);
        return {
            words: tow ? tow.length : 0,
            characters: text.length
        };
    }

    var textarea = document.getElementById("text");
    textarea.addEventListener("input", function() {
        var response = countWords(this.value);
        saveStatus = false;
        $("#rcount").html(response.words);
    }, false);
});