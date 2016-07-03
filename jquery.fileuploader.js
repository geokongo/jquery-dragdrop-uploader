/*!
 * jQuery FileUploader Plugin v0.0.1
 * https://github.com/GeoffreyOliver/jquery-fileuploader
 * 
 * This plugin enables you to upload image files, text files e.t.c to the server through drag and drop
 * 
 * Copyright 2015 - 2020 Geoffrey Bans
 * Released under the MIT license
 */
(function($){

	/**
	 * @var {} The object reference to the filedrop area
	 */
	var filedroparea;

	//plugin definition
	$.fn.fileuploader = function(options){
		
		//setting the default options
		var settings = $.extend({
			uploadurl: null,
			multiple: false,
			datatype: null,
			maxsize: null
		}, options);

	};

	//initialize
	function Init(){
		var fileselect = document.getElementById("fileselect"),
			filedrag = document.getElementById("filedrag"),
			submitbutton = document.getElementById("submitbutton");

		//file select
		fileselect.addEventListener("change", FileSelectHandler, false);

		//is XHR2 available?
		var xhr = new XMLHttpRequest();

		if (xhr.upload) {

			//file drop
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);

			filedrag.style.display = "block";



		}

	}

	//file drag hover
	function FileDragHover(e){
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}

	//file selection
	function FileSelectHandler(e){

		//cancel event and hover styling
		FileDragHover(e);

		//fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		//process all files
		for(var i = 0, f; f=files[i]; i++){
			ParseFile(f);
		}
	}

	function ParseFile(file) {

	/*
		Output(
			"<p>File information: <strong>" + file.name +
			"</strong> type: <strong>" + file.type +
			"</strong> size: <strong>" + file.size +
			"</strong> bytes</p>"
		);
	*/
		//display text
		if (file.type.indexOf("text") == 0) {
			var reader = new FileReader();
			reader.onload = function(e){
				Output(
					"<p><strong>" + file.name + ":</strong></p><pre>"+
					e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</pre>"
				);
			}
			reader.readAsText(file);
		}

		console.log(file.type);

		//display text
		if (file.type.indexOf("image") == 0) {
			var reader = new FileReader();
			reader.onload = function(e){
				Output("<p><strong>" + file.name + ":</strong><br>" + '<img width="200px" src="' + e.target.result + '"/></p>');
			}

			reader.readAsDataURL(file);
		}	
	}

	//upload JPG files
	function UploadFile(file){
		var xhr = new XMLHttpRequest();

		if (xhr.upload && file.type == "image/jpeg" && file.size <= document.getElementById("MAX_FILE_SIZE").value) {
			//start upload
			xhr.open("POST", document.getElementById("upload").action, true);
			xhr.setRequestHeader("X_FILENAME", file.name);
			xhr.send(file);

			//create progressbar
			var o = document.getElementById("progress");
			var progress = o.appendChild(document.createElement("p"));
			progress.appendChild(document.createTextNode("upload" + file.name));

			//progress bar
			xhr.upload.addEventListener("progress", function(e){
				var pc = parseInt(100 - (e.loaded / e.total * 100));
				progress.style.backgroundPosition = pc + "% 0";
			}, false);

			//file recieved/failed
			xhr.onreadystatechange = function(e){
				if (xhr.readyState == 4) {
					progress.className = (xhr.status == 200 ? "success" : "failure");
				}
			}
		}
	}
	// output information
	function Output(msg) {
		var m = document.getElementById("messages");
		m.innerHTML = msg + m.innerHTML;
	}


}(jQuery));