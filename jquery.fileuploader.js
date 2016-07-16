/*!
 * jQuery FileUploader Plugin v0.0.1
 * https://github.com/GeoffreyOliver/jquery-fileuploader
 * 
 * This plugin enables you to upload image files, text files e.t.c to the server through drag and drop without page relaod
 * 
 * Copyright 2015 - 2020 Geoffrey Bans
 * Released under the MIT license
 */
(function($){

	/**
	 * @var {} The object reference to the document element the user attached the plugin to.
	 */
	var fileuploaderdiv;

	/**
	 * @var {} The parent div object
	 */
	var parentDIV;

	/**
	 * @var {} The reference to the parent form containing the submit button
	 */
	var parentFORM;

	/**
	 * @var Integer The index of the current file to be uploaded
	 */
	var uploadCOUNT;

	/**
	 * @var Integer The total  number of files to be uploaded
	 */
	var totalFiles;

	/**
	 * @var {} The object reference to the file priview div
	 */
	var filePreviews;

	/**
	 * @var bool true|false This boolean stores whether ajax file upload is supported or not
	 */
	var uploadenabled;

	/**
	 * @var {} The object reference to the filepreview div
	 */
	var draganddroparea;

	/**
	 * This is the plugin definition and code required to upload files to the server.
	 * Begins by extending the $.fn object
	 * @param {} options The plugin configuration options provided by the user
	 */
	$.fn.fileuploader = function(options){
		
		//setting the default options
		var settings = $.extend({
			uploadurl: null,
			multiple: false,
			filetype: null,
			maxsize: null,
			filecount: null,
			instantupload: false
		}, options);

		//set the object reference to the form holder
		fileuploaderdiv = $(this)[0];

		//call initialization file
		uploadenabled =(window.File && window.FileList && window.FileReader);

		//set the drag and drop aread
		createDragAndDropArea();
		createFilePreviewArea();
		createInputButtons();

		/**
		 * This method sets the drag and drop area for file uploads
		 * @param null 
		 * @return null
		 */
		function createDragAndDropArea(){
			
			var fileErrorMessages = document.createElement("p");
			fileErrorMessages.style.color = "red";
			fileErrorMessages.className = "jquery-fileuploader-error-message";
			fileuploaderdiv.appendChild(fileErrorMessages)
			
			//append to the main fileuploaderdiv div
			draganddroparea = document.createElement("div");
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

			if (settings.multiple === true) {
				formInput.setAttribute("multiple", "true");
			} 

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

			//diable submit button if instant upload is set to true	
			if (settings.instantupload === true) {
				submitButton.setAttribute("disabled", "disabled");
			}

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

			//prevent browser form submission
			event.preventDefault();

			parentFORM = (event.target.form) ? event.target.form : null;
			filePreviews = event
							.target
							.parentNode
							.parentNode
							.querySelector("div.jquery-fileuploader-filepreviewarea")

			//call method to upload files
			uploadFiles(filePreviews);

		}

		/**
		 * This function handles file drop event by passing the dropped file(s) for preview
		 * @param {} event The file drop event object
		 */
		function handleFileDrop(event){
			
			parentDIV = event.target.parentNode;

			//cancel event default, hover styling and prevent default
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
		    var dataFile;
		    
		    if (imageFormat.test(file.type) !== false) {

				var reader = new FileReader();

				//create the image container
				var imgContainer = document.createElement("div");
				imgContainer.className = "jquery-uploader-img-container";

				//create the delete button
				var deleteButton = document.createElement("a");
				deleteButton.innerHTML = "Remove";
				deleteButton.className = "jquery-uploader-img-delete";
				deleteButton.href = "#";
				deleteButton.onclick = removeElement;
				
				//create the span to hold the text
				var span = document.createElement("span");
				span.appendChild(deleteButton);
				imgContainer.appendChild(span);

				var image = document.createElement("img");
				image.file = file;
				image.id = "element-to-upload";
				image.className = "jquery-uploader-img-thumbnail";
				imgContainer.appendChild(image);

				//create the progress bar placeholder
				var progress = document.createElement("div");
				progress.className = "jquery-uploader-progress";
				
				//compose the file name
				var fileName = file.name + " " + humanReadableFileSize(file.size);
				fileName =  (fileName.length >= 20) ? "..." + fileName.substr(fileName.length - 20) : fileName;

				var progressbar = document.createElement("div");
				progressbar.className = "jquery-uploader-progress-bar-placeholder";
				progressbar.setAttribute("role", "progressbar");
				progressbar.setAttribute("aria-valuenow", "0");
				progressbar.setAttribute("aria-valuemin", "0");
				progressbar.setAttribute("aria-valuemax", "100");
				progressbar.innerHTML = fileName;
				progressbar.style.width = "100%";

				progress.appendChild(progressbar);
				imgContainer.appendChild(progress);
				dataFile = imgContainer;
			
				reader.onload = function(event){
					image.src = event.target.result;
				}

				reader.readAsDataURL(file);

		    }
			//display file information for any other file
			else {

				//create the image container
				var itemContainer = document.createElement("div");
				itemContainer.className = "jquery-uploader-item-container";


				//create the span to hold the item
				var itemSpan = document.createElement("div");
				itemSpan.className = "jquery-uploader-item-content jquery-uploader-progress";
				itemContainer.appendChild(itemSpan);
				
				//create the delete button
				var deleteButton = document.createElement("div");
				deleteButton.className = "jquery-uploader-item-close";
				deleteButton.onclick = removeElement;
				itemSpan.appendChild(deleteButton);

				//compose the file name
				var fileName = file.name + " " + humanReadableFileSize(file.size);
				fileName =  (fileName.length >= 20) ? "..." + fileName.substr(fileName.length - 20) : fileName;

				//insert file info
				var progressbar = document.createElement("div");
				progressbar.innerHTML = fileName;
				progressbar.className = "jquery-uploader-progress-bar-placeholder";
				progressbar.setAttribute("role", "progressbar");
				progressbar.setAttribute("aria-valuenow", "0");
				progressbar.setAttribute("aria-valuemin", "0");
				progressbar.setAttribute("aria-valuemax", "100");
				progressbar.style.width = "100%";
				itemSpan.appendChild(progressbar);

				var anyFile = document.createElement("p");
				anyFile.style.display = "none";
				anyFile.file = file;
				anyFile.id = "element-to-upload";

				itemContainer.appendChild(anyFile);
				dataFile = itemContainer;

			}

			//check for file size
			if (settings.maxsize !== null) {

				//check if the file excedes allowed size
				if (file.size > (settings.maxsize * 1000)) {
					parentDIV.querySelector(".jquery-fileuploader-error-message").innerHTML = "File too large!";
				} 
				else {

					//check file type
					if (settings.filetype !== null) {

						if (settings.filetype == 'image') {

						} 
						else {

						}

					} 
					else {

						//check if multiple files is allowed
						if (settings.multiple === true) {

							//check if max number of files is set
							if (settings.filecount !== null) {

								if (parentDIV.querySelector("div.jquery-fileuploader-filepreviewarea").childNodes.length >= settings.filecount) {
									//replace the first element
									parentDIV
										.querySelector("div.jquery-fileuploader-filepreviewarea")
										.insertBefore(dataFile, parentDIV.querySelector("div.jquery-fileuploader-filepreviewarea").firstChild);

									parentDIV.querySelector("div.jquery-fileuploader-filepreviewarea")
										.removeChild(
											parentDIV
												.querySelector("div.jquery-fileuploader-filepreviewarea")
												.lastChild);
								} 
								else {
									//append element to preview area
									parentDIV
										.querySelector("div.jquery-fileuploader-filepreviewarea")
										.appendChild(dataFile);

								}

							} 
							else {
								//append element to preview area
								parentDIV
									.querySelector("div.jquery-fileuploader-filepreviewarea")
									.appendChild(dataFile);

							}

						} 
						else {
							
							var childs = parentDIV.querySelector("div.jquery-fileuploader-filepreviewarea").childNodes;
							
							//remove items that are already present
							$.each(childs,function(key, child){
								child.parentNode.removeChild(child);
							});

							parentDIV
								.querySelector("div.jquery-fileuploader-filepreviewarea")
								.appendChild(dataFile);

						}

					}

				}

			} 
			else {
				//check file type
				if (settings.filetype !== null) {


				} 
				else {

					//check if multiple files is allowed
					if (settings.multiple === true) {

						//check if max number of files is set
						if (settings.filecount !== null) {

							if (parentDIV.querySelector("div.jquery-fileuploader-filepreviewarea").childNodes.length >= settings.filecount) {
								//replace the first element
								parentDIV
									.querySelector("div.jquery-fileuploader-filepreviewarea")
									.insertBefore(dataFile, parentDIV.querySelector("div.jquery-fileuploader-filepreviewarea").firstChild);

								parentDIV.querySelector("div.jquery-fileuploader-filepreviewarea")
									.removeChild(
										parentDIV
											.querySelector("div.jquery-fileuploader-filepreviewarea")
											.lastChild);

							} 
							else {
								//append element to preview area
								parentDIV
									.querySelector("div.jquery-fileuploader-filepreviewarea")
									.appendChild(dataFile);

							}

						} 
						else {
							//append element to preview area
							parentDIV
								.querySelector("div.jquery-fileuploader-filepreviewarea")
								.appendChild(dataFile);

						}

					} 
					else {
						
						var childs = parentDIV.querySelector("div.jquery-fileuploader-filepreviewarea").childNodes;
						
						//remove items that are already present
						$.each(childs,function(key, child){
							child.parentNode.removeChild(child);
						});

						parentDIV
							.querySelector("div.jquery-fileuploader-filepreviewarea")
							.appendChild(dataFile);

					}

				}

			}

		}

		/**
		 * This method removes an uploaded element from the previewarea
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

			//create the mutlipart-formdata type of form
			formDATA = new FormData();

			//check if there are items to upload
			if (previews.childNodes.length > 0) {
 				
 				//set the number of files to be uploaded
 				totalFiles = previews.childNodes.length;
 				uploadCOUNT = 0;

				sendFile();

			}

		}

		/**
		 * This function sends a file through ajax
		 * @param null
		 * @return null
		 */
		function sendFile(){

			//check that there are still files to be uploaded
			if(uploadCOUNT < totalFiles){

				var formDATA = new FormData();

				//get all the other form fields
				if (parentFORM !== null) {

					//loop through all the form elements, adding their name/value pairs
					for (var i = 0; i < parentFORM.elements.length; i++) {

						var element = parentFORM.elements[i];
						if (element.name) formDATA.append(element.name,element.value);

					}

				}

				var itemContainer = filePreviews.childNodes[uploadCOUNT]; //getElementById("element-to-upload");
				var fileToUpload = itemContainer.querySelector("#element-to-upload");

				//set the progress bar
				var bar = itemContainer.querySelector(".jquery-uploader-progress-bar-placeholder");
				bar.className += " jquery-uploader-progress-bar";
				bar.style.width = "50%";

				//set progress animation
				var prog = itemContainer.querySelector(".jquery-uploader-progress");
				prog.className += " active";

				//change the submit button text to uploading
				parentFORM.querySelector("input[type=submit]").value = "Uploading...";
				
				//start upload
				var xhr = new XMLHttpRequest();
				xhr.open("POST", "http://localhost:3000/users/ajax", true);
				formDATA.append("file",fileToUpload.file, fileToUpload.file.name);
				xhr.send(formDATA);

				//file recieved/failed
				xhr.onreadystatechange = function(){

					if (xhr.readyState == 4) {

						if (xhr.status == 200) {

							uploadCOUNT += 1;

							//set the progress bar
							var deleteButton = itemContainer.querySelector(".jquery-uploader-img-delete");
							
							if (deleteButton) {

								deleteButton.parentNode.style.opacity = "1";
								deleteButton.innerHTML = "Uploaded!";	

							} 
							//set progress to 100% and change style class
							bar.className = "jquery-uploader-progress-bar-complete";
							bar.style.width = "100%";

							//stop animation
							var prog = itemContainer.querySelector(".jquery-uploader-progress");
							prog.className = removeClass(prog.className, "active");

							//send the next file
							sendFile();

						} 
						else {


							//set the progress bar
							var deleteButton = itemContainer.querySelector(".jquery-uploader-img-delete");
							deleteButton.parentNode.style.opacity = "1";
							deleteButton.innerHTML = "Failed!";

							console.log(xhr.responseText);
						}
						//progress.className = (xhr.status == 200 ? "success" : "failure");
					}
				}

			}
			else{

				parentFORM.querySelector("input[type=submit]").value = "Uploaded!";	
				parentFORM.querySelector("input[type=submit]").setAttribute("disabled", "disabled");

			} 

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

	/**
	 * This method removes classes from an element
	 * @param string current The string containing the classes
	 * @param string remove The particular class to remove
	 * @return string The final class string after remove
	 */
	function removeClass(current, remove){
		var newclass = "";
		var classList = current.split(" ");

		//loop to remove this particular class
		for(var i = 0; i < classList.length; i++){
			if(classList[i].trim() !== remove){
				newclass += classList[i].trim() + " ";
			}
		}

		return newclass;
	};
}(jQuery));