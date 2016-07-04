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
	 * @var {} The triggered event object
	 */
	var eventObject;

	/**
	 * @var bool true|false This boolean stores whether ajax file upload is supported or not
	 */
	var uploadenabled;
	var draganddroparea;

	//plugin definition
	$.fn.fileuploader = function(options){
		
		//set the object reference to the form holder
		fileuploaderdiv = $(this)[0];

		//call initialization file
		uploadenabled =(window.File && window.FileList && window.FileReader);

		//set the drag and drop aread
		createDragAndDropArea();
		createFilePreviewArea();
		createInputButtons();

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

			draganddroparea = document.createElement("div");
			
			//append to the main fileuploaderdiv div
			fileuploaderdiv.appendChild(draganddroparea);
			
			//is XHR2 available?
			var xhr = new XMLHttpRequest();

			if (xhr.upload) {


				//add event listeners to the file drag area
				draganddroparea.addEventListener("dragover", handleDragEvent);
				draganddroparea.addEventListener("dragleave", handleDragEvent);
				draganddroparea.addEventListener("drop", handleFileSelect);

				//display the file drag ared div
				draganddroparea.style.display = "block";

			}

			draganddroparea.className = "jquery-fileuploader-draganddroparea";
			draganddroparea.appendChild(document.createTextNode("Drop files here to upload"));

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
		function createInputButtons(){
			
			//div to hold the buttons
			var inputButtons = document.createElement("div");
			inputButtons.className = "jquery-uploader-input-buttons";

			//file input button
			var inputfield = document.createElement("input");
			inputfield.type = "file";
			inputButtons.appendChild(inputfield);
			
			inputfield.name = "files";
			inputfield.addEventListener("change", handleFileSelect, false);

			//form submit 
			var formsubmitbutton = document.createElement("input");
			formsubmitbutton.type = "submit";
			formsubmitbutton.value = "Upload";
			inputButtons.appendChild(formsubmitbutton);
			
			//apend the main filedrop area div
			fileuploaderdiv.appendChild(inputButtons);

		}

		//file drag hover
		function handleDragEvent(event){

			//prevent the default from occuring and change the styles as appropriate
			event.stopPropagation();
			event.preventDefault();
			event.target.className = (event.type == "dragover" ? "jquery-fileuploader-draganddroparea draganddroparea-hover" : "jquery-fileuploader-draganddroparea");
		
		}

		//file selection
		function handleFileSelect(event){
			
			eventObject = event;

			//cancel event default and hover styling
			handleDragEvent(event);

			//fetch FileList object
			var files = event.target.files || event.dataTransfer.files;

			//loop through all files calling the file preview method
			for(var file in files){

				previewFile(files[file]);

			}

		}

		function previewFile(file) {

		/*
			Output(
				"<p>File information: <strong>" + file.name +
				"</strong> type: <strong>" + file.type +
				"</strong> size: <strong>" + file.size +
				"</strong> bytes</p>"
			);
		*/
			//check for image file
		    var imageFile = /^image\//;
		    
		    if (imageFile.test(file.type)) {

				var reader = new FileReader();
				var image = document.createElement("img");

				image.file = file;
				image.className = "jquery-uploader-img-thumbnail";
				eventObject.target.parentNode.childNodes[1].appendChild(image);

				reader.onload = function(event){

					//var string = "<img width='200px' src='" + e.target.result + "'/>";
					image.src = event.target.result;
				
				}

				reader.readAsDataURL(file);

		    }
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