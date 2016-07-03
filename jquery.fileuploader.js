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
	var fileuploaderdiv;

	/**
	 * @var bool true|false This boolean stores whether ajax file upload is supported or not
	 */
	var uploadenabled;

	//plugin definition
	$.fn.fileuploader = function(options){
		
		//set the object reference to the form holder
		fileuploaderdiv = $(this)[0];

		//call initialization file
		uploadenabled =(window.File && window.FileList && window.FileReader);

		//set the drag and drop aread
		createDragAndDropArea();
		createFilePreviewArea();
		createSubmitButton();

		//setting the default options
		var settings = $.extend({
			uploadurl: null,
			multiple: false,
			datatype: null,
			maxsize: null,
			instantupload: false
		}, options);

		/**
		 * This method sets the drag and drop area for file uploads
		 * @param null 
		 * @return null
		 */
		function createDragAndDropArea(){

			var draganddroparea = document.createElement("div");
			draganddroparea.className = "jquery-fileuploader-draganddroparea";
			draganddroparea.appendChild(document.createTextNode("Drop files here to upload"));
			draganddroparea.appendChild(document.createElement("br"));
			draganddroparea.appendChild(document.createTextNode("Or"));
			draganddroparea.appendChild(document.createElement("br"));

			//create an input file
			var inputfield = document.createElement("input");
			inputfield.type = "file";
			inputfield.name = "images";
			inputfield.addEventListener("change", FileSelectHandler, false);
			
			//append to the draganddroparea div
			draganddroparea.appendChild(inputfield);

			//add event listeners to the file drag area
			draganddroparea.addEventListener("dragover", FileDragHover, false);
			draganddroparea.addEventListener("dragleave", FileDragHover, false);
			draganddroparea.addEventListener("drop", FileSelectHandler, false);

			//display the file drag ared div
			draganddroparea.style.display = "block";

			//append to the main fileuploaderdiv div
			fileuploaderdiv.appendChild(draganddroparea);

		}

		/**
		 * This method creates the area for previewing uploaded files
		 * @param null
		 * @return null
		 */
		function createFilePreviewArea(){

			var filepreviewarea = document.createElement("div");
			filepreviewarea.className = "jquery-fileuploader-filepreviewarea";

			//append to the main fileuploaderdiv div
			fileuploaderdiv.appendChild(filepreviewarea);

		}

		/**
		 * This method creates the button controls for uploading the files
		 * @param null
		 * @return null
		 */
		function createSubmitButton(){
			
			var formsubmitbutton = document.createElement("input");
			formsubmitbutton.type = "submit";
			formsubmitbutton.name = "Upload";
			formsubmitbutton.value = "Upload";

			//apend the main filedrop area div
			fileuploaderdiv.appendChild(formsubmitbutton);

		}

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

	};

}(jQuery));