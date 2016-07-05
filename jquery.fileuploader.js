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
	 * @var {} The parent div object
	 */
	var parentDIV;

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
				draganddroparea.addEventListener("drop", handleFileDrop);

				//display the file drag ared div
				draganddroparea.style.display = "block";

			}

			draganddroparea.className = "jquery-fileuploader-draganddroparea";
			draganddroparea.appendChild(document.createTextNode("Drop files here to upload"));

			draganddroparea.appendChild(document.createElement("br"));
			draganddroparea.appendChild(document.createTextNode("--or--"));
			draganddroparea.appendChild(document.createElement("br"));
			//create form input field
			var formInput = document.createElement("input");
			formInput.type = "file";
			formInput.onchange = handleFileSelect;

			//append to the parent div
			draganddroparea.appendChild(formInput);

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

			//form submit 
			var submitButton = document.createElement("input");
			submitButton.type = "submit";
			submitButton.className = "jquery-uploader-file-submit-button";
			submitButton.value = "Upload";
			submitButton.onclick = handleFormSubmit;

			inputButtons.appendChild(submitButton);
			
			//apend the main filedrop area div
			fileuploaderdiv.appendChild(inputButtons);

		}

		//file drag hover
		function handleDragEvent(event){

			//prevent the default from occuring and change the styles as appropriate
			event.stopPropagation();
			event.preventDefault();
			draganddroparea.className = (event.type == "dragover" ? "jquery-fileuploader-draganddroparea draganddroparea-hover" : "jquery-fileuploader-draganddroparea");
		
		}

		/**
		 * This method diables the form submit button and calls the method to upload the files
		 * @param {} event The button click event object
		 * @return null
		 */
		function handleFormSubmit(event){

			//call method to upload files
			uploadFiles(event.target.parentNode.parentNode.childNodes[1]);

		}

		//file selection
		function handleFileDrop(event){
			
			parentDIV = event.target.parentNode;

			//cancel event default and hover styling
			handleDragEvent(event);

			//fetch FileList object
			var files = event.target.files || event.dataTransfer.files;

			if (files){

				//loop through each file in a loop and preview
			    [].forEach.call(files, previewFile);

			}

		}

		//file selection
		function handleFileSelect(event){
			
			parentDIV = event.target.parentNode.parentNode;

			//fetch FileList object
			var files = event.target.files || event.dataTransfer.files;

			if (files){

				//loop through each file in a loop and preview
			    [].forEach.call(files, previewFile);

			}

		}

		function previewFile(file) {

			//check for image file
		    var imageFormat = /^image\//;
		    
		    if (imageFormat.test(file.type) !== false) {

				var reader = new FileReader();

				//create the image container
				var itemContainer = document.createElement("div");
				itemContainer.className = "jquery-uploader-item-container";

				//create the delete button
				var deleteButton = document.createElement("a");
				deleteButton.innerHTML = "Remove";
				deleteButton.className = "jquery-uploader-item-delete";
				deleteButton.href = "#";
				deleteButton.onclick = removeElement;
				
				//create the span to hold the text
				var span = document.createElement("span");
				span.appendChild(deleteButton);
				itemContainer.appendChild(span);

				var image = document.createElement("img");
				image.file = file;
				image.className = "jquery-uploader-img-thumbnail";
				itemContainer.appendChild(image);
				
				//append to the preview div
				parentDIV.childNodes[1].appendChild(itemContainer);

				reader.onload = function(event){

					//var string = "<img width='200px' src='" + e.target.result + "'/>";
					image.src = event.target.result;
				
				}

				reader.readAsDataURL(file);

		    }
			//display file information for any other file
			else {

				//create the image container
				var itemContainer = document.createElement("div");
				itemContainer.className = "jquery-uploader-item-container";

				//create the delete button
				var deleteButton = document.createElement("a");
				deleteButton.innerHTML = "Remove";
				deleteButton.className = "jquery-uploader-item-delete";
				deleteButton.href = "#";
				deleteButton.onclick = removeElement;

				//create the span to hold the text
				var span = document.createElement("span");
				span.appendChild(deleteButton);
				itemContainer.appendChild(span);

				var anyFile = document.createElement("p");
				anyFile.style.padding = "4px";
				anyFile.file = file;
				var fileName = (file.name.length >= 20) ? "..."+file.name.substr(file.name.length - 15) : file.name;
				anyFile.innerHTML =  fileName+ "<br>" + humanReadableFileSize(file.size);
				itemContainer.appendChild(anyFile);

				//append to the preview div
				parentDIV.childNodes[1].appendChild(itemContainer);

			}

		}

		/**
		 * This method removes an element from the DOM
		 * @param {} event The remove anchor click event object
		 * @return null
		 */
		function removeElement(event){

			event.preventDefault();
			
			//remove the parent of this div element
			event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);

		}

		/**
		 * This function initiates uploading of all the selected files
		 * @param {} previews The object reference for the file preview area
		 * @return null
		 */
		function uploadFiles(previews){

			alert(previews.childNodes.length);
			//create a sub-function for sending files
			function sendFile(file){

				//create the formdata to append
				var formData = new FormData();
				formData.append('file', file);

				$.ajax({

					url: null,
					type: "POST",
					data: {},
					success: function(data){
						//callbakc
						alert("Success!");
					},
					error: function(err){

					}

				});
			
			}


/*
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

*/
		}

		/**
		 * This method returns the file size in human readable format
		 * @param Integer bytes The file size in raw bytes
		 * @return String The readable string format of the file size
		 */
		function humanReadableFileSize(bytes, si = true) {

		    var thresh = si ? 1000 : 1024;

		    if(Math.abs(bytes) < thresh) {

		        return bytes + ' B';

		    }

		    var units = si
		        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
		        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
		    var u = -1;

		    do {

		        bytes /= thresh;
		        ++u;

		    } while(Math.abs(bytes) >= thresh && u < units.length - 1);

		    return bytes.toFixed(1)+' '+units[u];
		}
	};

}(jQuery));