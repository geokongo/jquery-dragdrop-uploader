# jQuery FileUploader

This is a plugin based on jQuery and JavaScript that enables you to upload any type of file to your server without page reload. 

The files are uploaded via ajax through drag and drop. It is lightweight and only requires the inclusion of one file and default configuration.

### Features ###
* [Drag and Drop Files to Upload](#draganddrop)
* [Upload Multiple Files](#multiplefiles)
* [Multiple Server Support](#anyserver)
* [Limit the Number of Files to Upload](#filecountlimit)
* [Limit the Size of Files to Upload](#filesizelimit)
* [Limit the Type of Files to Upload](#filetypelimit)

## [Live Demo](https://GeoffreyOliver.github.io/jquery.fileuploader/index.html) ###

## Example Usage ##

The files are sent via post and can be accessed just like any other uploaded file. The demos show how to save access the uploaded files for different programming languages.

For a single upload field, the uploads are done once after which the upload button is diabled to avoid duplicate file uploads.

In the case of multiple file uploads, the file are uploaded one at a time in succession and the progressbar shows the upload status of each file.

You will be able to preview image files before uploading. For each file you choose for upload, the name and file size is displayed to enable you be sure of the file you desire to upload.

Besides using the drag and drop feature to upload files, you can as well select files by clicking on the file browser input box and select the files.

### <a name="draganddrop"> Drag and Drop Files to Upload </a> ###

This is a jQuery plugin so it requires the jQuery library to be loaded first.

```javascript
<script type="text/javascript" src="scripts/js/jquery.min.js"></script> 
```

After loading the jquery library, load the plugin's minified javascript file.

```javascript 
<script type="text/javascript" src="scripts/js/jquery.fileuploader.min.js"></script> 
```
You do not need to load any separate css files as the styling of the drag and drop area is dynamically inserted using javascript. 

Attach the fileuploader() function to an empty ` div ` field using an ` id ` as an identifier. 

The basic configuration is to separate an upload url.

```javascript 
$("#profile-pic").fileuploader({
	uploadurl: "http://localhost:3000/app/users/profile"
}); 
```
### <a name="multiplefiles"> Upload Multiple Files </a> ### 

In order to be able to upload multiple files at once, set the multiple files option to ` true ` 

```javascript 
$("#profile-pic").fileuploader({
	uploadurl: "http://localhost:3000/app/users/profile",
	multiple: true
}); 
```

With this you can drag and drop as many files as you desire and then upload them at once.

Multiple file upload is disabled by default, so that user's can only upload one file. Therefore setting this option to false or ommitting it altogether means then same thing - only one file upload.

### <a name="anyserver"> Multiple Server Support </a> ### 

You can upload your files to any server using any programming language in the back end i.e. java, php, node.js, ruby e.t.c.

The uploaded file are sent via post and so can be accessed with any custom code.

### <a name="filecountlimit"> Limit the Number of Files to Upload </a> ### 

To limit the number of file to be uploaded at one time, set the ` multiple ` option to ` true ` and then specify the number of files in the ` filecount ` option.

```javascript 
$("#profile-pic").fileuploader({
	uploadurl: "http://localhost:3000/app/users/profile",
	multiple: true,
	filecount: 3
}); 
```

If a user attemps to include more than the allowed number of files to be uploaded, an error message will be shown to them and the extra file is not added to the upload queue.

However, then can still swap files by removing other files and adding new ones, before upload.

### <a name="filesizelimit"> Limit the Size of Files to Upload </a> ### 

You can restrict the size of files to be uploaded to not exceede a particular file size. This you do by specifying the ` maxsize ` option in the configuration. Provide the file size in kilo bytes(kB) as an interger without the units.

```javascript 
$("#profile-pic").fileuploader({
	uploadurl: "http://localhost:3000/app/users/profile",
	maxsize: 1000
}); 
```

When a user selects to upload a file that excedes the maxsize specified, an error message is displayed and the file is not added to the upload queue.

### <a name="filetypelimit"> Limit the Type of Files to Upload </a> ### 

It is as well possible to only require the upload of particular file types i.e. images, pdf e.t.c.
Specify the type of file to upload in the ` filetype ` option. 

```javascript 
$("#profile-pic").fileuploader({
	uploadurl: "http://localhost:3000/app/users/profile",
	maxsize: 1000,
	filetype: "image/jpeg"
}); 
```

This would only allow only file types that are images of the jpeg format to be added to the download queue. If the user attempts to include a file of a different type, they would get an error message and the file is not included in the upload queue.

Files of type image are automatically previewed within the browser before download. For all other file types, only the shortened file name and size are shown.