const fs = require('fs')
const multer = require('multer')
const fetch = require('node-fetch');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const Dropbox = require('dropbox');
const path = require("path");

cloudinary.config({ 
    cloud_name:  config.cloudinary_cloud_name, 
    api_key: config.cloudinary_api_key, 
    api_secret: config.cloudinary_api_secret
  });

var Imagestorage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'blossom_lms',
    allowedFormats: ['jpg', 'png'],
    filename: function (req, file, cb) {
        cb(null, Date.now())
    }
});


var localStorage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './docs');
    },
    filename: function(req, file, callback){
        var originalname = file.originalname.substr(0, file.originalname.lastIndexOf("."))
        console.log(originalname)
        var filename = originalname + '-' + Date.now() + path.extname(file.originalname);
        callback(null, filename);
    }
});
  
module.exports = {
    image: multer({ storage: Imagestorage }),
    doc: multer({storage: localStorage }),
    uploadDoc: (file) => {
        var dbx = new Dropbox.Dropbox({ accessToken: config.dropbox_secret, fetch })
        return new Promise((resolve, reject) => {
                dbx.filesUpload({ path: '/courses/'+file.filename, contents: file }).then(function (res) {
                resolve(res)
            }).catch(function (error) {
                Logger.error(error);
            })
        })
    },
    downloadDoc: (path) => {
        var dbx = new Dropbox.Dropbox({ accessToken: config.dropbox_secret, fetch })
        return new Promise((resolve, reject) => {
            dbx.filesDownload({path: path}).then(function (res) {
                console.log(res)
                var filename = res.name
                var file = './downloads/' + filename;
                
            //   fs.writeFile(file, res.fileBinary, 'binary', function(err) {
            //     if(err)
            //       console.log(err);
            //     else
            //       console.log("The file was saved!");
            //   });      
                
            }).catch(function (error) {
                console.log(error)
                Logger.error(error);
            })
        })
    }
}