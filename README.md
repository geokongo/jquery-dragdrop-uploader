# jQuery FileUploader

This is a plugin based on jQuery and JavaScript that enables you to upload any type of file to your server without page reload. 

The files are uploaded via ajax through drag and drop. It is lightweight and only requires the inclusion of one file and default configuration.

### Features 
* [Drag and Drop Files to Upload](#draganddrop)
* [Upload Multiple Files](#multiplefiles)
* [Multiple Language Support](#anyserver)
* [Limit the Number of Files to Upload](#filecountlimit)
* [Limit the Size of Files to Upload](#filesizelimit)
* [Limit the Type of Files to Upload](#filetypelimit)
* [Instant File to Upload](#instantupload)

## [Live Demo](https://GeoffreyOliver.github.io/jquery.fileuploader/index.html)

## Example Usage

The files are sent via post and can be accessed just like any other uploaded file. The demos show how to  access the uploaded files for different programming languages.

For a single upload field, the uploads are done once after which the upload button is disabled to avoid duplicate file uploads.

In the case of multiple file uploads, the files are uploaded one after another in succession and the progressbar shows the upload status of each file.

You will be able to preview image files thumbnails before uploading. For any other file type only the name and file size is displayed to enable you be counter check the file you desire to upload.

Besides using the drag and drop feature to upload files, you can as well select files by clicking on the file browser input box and select the files.

Should you want to remove an image so that it's not uploaded, hover over the image and click on ` Remove ` to delete it. For other file types click on the close icon on the top right corner of the file name to remove it from the upload queue.

### <a name="draganddrop"> Drag and Drop Files to Upload </a>

This is a jQuery plugin so it requires the jQuery library to be loaded first.

```javascript
<script type="text/javascript" src="scripts/js/jquery.min.js"></script> 
```

After loading the jquery library, load the plugin's minified javascript file.

```javascript 
<script type="text/javascript" src="scripts/js/jquery.fileuploader.min.js"></script> 
```
You do not need to load any separate css files as the styling of the drag and drop area is dynamically inserted using javascript. 

Attach the fileuploader() function to an empty ` div ` field using an ` id ` as a unique identifier. <strong> Ensure the div is empty.</strong>

The basic configuration is to specify an upload url.

```javascript 
$("#profile-pic").fileuploader({
	uploadurl: "http://localhost:3000/app/users/profile"
}); 
```
### <a name="multiplefiles"> Upload Multiple Files </a> 

In order to be able to upload multiple files at once, set the ` multiple ` files option to ` true ` 

```javascript 
$("#profile-pic").fileuploader({
	uploadurl: "http://localhost:3000/app/users/profile",
	multiple: true
}); 
```

With this you can drag and drop as many files as you desire and then upload them at once.

Multiple file upload is disabled by default, so that users can only upload one file. Therefore setting this option to false or ommitting it altogether means then same thing - only one file uploaded.

If multiple files upload is set to false and you attempt to add more than one file, the last file to be added will replace the previous file added.

### <a name="anyserver"> Multiple Language Support </a> 

You can upload your files to any server using any programming language in the back end i.e. java, php, node.js, ruby e.t.c. as you desire.

The uploaded files are sent via post and so can be accessed with any custom code.

### <a name="filecountlimit"> Limit the Number of Files to Upload </a> 

To limit the number of files to be uploaded at one time, set the ` multiple ` option to ` true ` and then specify the number of files in the ` filecount ` option.

```javascript 
$("#profile-pic").fileuploader({
	uploadurl: "http://localhost:3000/app/users/profile",
	multiple: true,
	filecount: 3
}); 
```

If a user attemps to add more than the allowed number of files to be uploaded, the newly added files will replace the previous files from top to bottom i.e. the last item is removed and the items pushed down.

However, they can as well swap files by manually deleting other files and adding new ones, before upload.

Specifying ` filecount ` while the ` multiple ` option is set to false or omitted would only allow one file  to be uploaded.

### <a name="filesizelimit"> Limit the Size of Files to Upload </a>

You can restrict the size of files to be uploaded to not exceede a particular file size. This you do by specifying the ` maxsize ` option in the configuration. Provide the file size in kilo bytes(kB) as an interger without the units and without any panctuation.

```javascript 
$("#profile-pic").fileuploader({
	uploadurl: "http://localhost:3000/app/users/profile",
	maxsize: 1000
}); 
```

When a user selects to upload a file that excedes the maxsize specified, an error message is displayed and the file is not added to the upload queue.

### <a name="filetypelimit"> Limit the Type of Files to Upload </a>

It is as well possible to only require the upload of particular file types i.e. images, pdf e.t.c.

Specify the type of file to upload in the ` filetype ` option. 

```javascript 
$("#profile-pic").fileuploader({
	uploadurl: "http://localhost:3000/app/users/profile",
	maxsize: 1000,
	filetype: "image"
}); 
```

This would only allow file types that are images of the jpeg format to be added to the download queue. If the user attempts to include a file of a different type, they would get an error message and the file is not included in the upload queue.

Files of type image are automatically previewed within the browser before upload. For all other file types, only the shortened file name and size are shown.

### <a name="instantupload"> Instant File to Upload </a>

You can decide to have your files uploaded immediately after the user selects them. The files would still go through previous checks like filetype and maxsize validation. If they are the allowed files, they are immediately uploaded. 

For the case of images files, the thumbnail of the image is displayed after upload is perfomed.

```javascript 
$("#profile-pic").fileuploader({
	uploadurl: "http://localhost:3000/app/users/profile",
	maxsize: 1000,
	filetype: "image/jpeg",
	instantupload: true
}); 
```

By default instantupload is set to false and you will need to click on the submit button to begin uploading files after selecting them. 

In case you set the file instantupload to` true ` the submit/upload button will be in a disabled state(unusable) in order to avoid duplicate uploads by the user.