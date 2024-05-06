const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, __dirname + '/public/uploads');
    },
    filename: function(req, file, callback){
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploader = multer({
    storage: storage
});

module.exports = uploader;
