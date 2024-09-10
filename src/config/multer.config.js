
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let folder = '';
    if (file.originalname.startsWith('profile')) {
      folder = 'profiles';
    } else if (file.originalname.startsWith('product')) {
      folder = 'products';
    } else if (file.originalname.startsWith('dni') || file.originalname.startsWith('domicilio') || file.originalname.startsWith('cuenta')) {
      folder = 'documents';
    }

    const nuevaruta = path.join( __dirname,'..','public','uploads', folder); 
    callback(null, nuevaruta);
  },
  filename: function (req, file, callback) {
    const extension = path.extname(file.originalname); 
    const basename = path.basename(file.originalname, extension); 
    callback(null, `${Date.now()}-${basename}${extension}`); 
  }
});

//middleware
const uploader = multer({
  storage: storage
});

module.exports = uploader;
