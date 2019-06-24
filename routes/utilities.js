
var express = require('express');
var Upload = require('s3-uploader');
var router = express.Router();
var util = require("util");
var bucketurl = "gardenhelp/property/images";
var multipart = require('connect-multiparty');
var uuid = require('node-uuid');
var multipartMiddleware = multipart();

var fs = require('fs'),
    S3FS = require('s3fs'),
    s3fsImpl = new S3FS(bucketurl, {
    accessKeyId: 'AKIAIAPNAD7DFVZM7GYQ',
    secretAccessKey: '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',
    signatureVersion:'v4'
});

// Create our bucket if it doesn't exist
s3fsImpl.create().then(function() {
 console.log("Bucket Created Successfully");
}, function(reason) {
  console.log("Unable to create bucket");
});;

router.post('/image/upload',multipartMiddleware, function (req, res) {




var file = req.files.file;
console.log(file);

var filename = uuid.v4() + '.jpg'
if (file.originalFilename != '')
{
  filename =  file.originalFilename
}

console.log(filename);
var stream = fs.createReadStream(file.path);

return s3fsImpl.writeFile(filename, stream).then(function () {

    fs.unlink(file.path, function (err) {
        
	if (err)
    {
       
       res.status(401);
      	res.json({
        "status": 401,
        "message": "There was a problem"
      });
       
    } 
        
    });


    res.status(200);
    res.json({success: true, file: filename});

    
});
});

module.exports = router;