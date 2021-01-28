const express = require('express')
const multer = require('multer')
const path = require('path')

//set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    const mimetype = filetypes.test(file.mimetype)
    if(extname && mimetype){
        return cb(null, true);
    } else{
        cb("Error, Images Only!")
    }
}

const upload = multer({
    storage: storage,
    limits: {fileSize: 2000000},
    fileFilter: function(req, file, cb){
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

        const mimetype = filetypes.test(file.mimetype)
        if(extname && mimetype){
            return cb(null, true);
        }
        else{
            cb("Error, Images Only!")
        }
    }
}).single('tiqu_img')

//init app
const app = express()

app.set('view engine', 'ejs')

app.use(express.static('./public'))

app.get('/', (req, res) => res.render('index'))

app.post('/upload/', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('index', {
                msg: err
            })
        }
        else{
            if(req.file == undefined){
                res.render('index', {
                    msg: 'Error, no file selected!'
                })
            }
            else{
                res.render('index', {
                    msg: "file uploaded",
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})

app.listen(3000, console.log('Listening to port 3000...'))