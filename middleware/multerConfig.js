const multer = require('multer')

var storage = multer.diskStorage({
    destination  : function(req,file,cb){
        const allowedFileTypes = ['image/png','image/jpeg']
        if(!allowedFileTypes.includes(file.mimetype)){
            cb(new Error('Invalid fileType'))
            return ;
        }
        cb(null,'./uploads/')
    },
    filename : function(req,file,cb){
        cb(null,Date.now()+ "-" + file.originalname)
    }
})

module.exports = {
    multer,
    storage
}