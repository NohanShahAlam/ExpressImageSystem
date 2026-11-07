
var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');

const upload = multer({ dest: 'uploads/' });

const mime = {
   'png': 'image/png',
   'jpeg': 'image/jpeg',
   'jpg': 'image/jpeg',
   'gif': 'image/gif',
   'webp': 'image/webp',
};

const dirPath = path.join(__dirname, '../public/images');

/* GET home page */

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Test7 - FileSystem' });
});

/* GET uploadImages */

router.get('/uploadImages', function(req, res, next) {
    res.render('uploadImages', { title: 'FileSystem' });
});

/* POST uploadImages */

router.post('/uploadImages', upload.array('image', 2), function(req, res, next) {

    if (!req.files || req.files.length == 0) {
        return res.status(400).send('No files uploaded');
    }

    // Crear la carpeta si no existe
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    for (let i = 0; i < req.files.length; i++) {

        let file = req.files[i];
        let ext = path.extname(file.originalname).toLowerCase().substring(1);

        if (!mime[ext] || mime[ext] !== file.mimetype || file.size > 5 * 1024 * 1024) {
            fs.unlinkSync(file.path);
            return res.status(400).send('File not accepted');
        }

        let newPath = path.join(dirPath, file.filename + '.' + ext);

        fs.renameSync(file.path, newPath);
    }

    res.redirect('showImages');
});

/* GET showImages */

router.get('/showImages', function(req, res, next) {

    fs.readdir(dirPath, function(err, files) {

        if (err) {
            return res.status(500).send('Internal Error');
        }

        let images = [];

        for (let i = 0; i < files.length; i++) {
            images.push('images/' + files[i]);
            console.log(files[i]);
        }

        console.log(images);

        res.render('showImages', {
            title: 'Images uploads',
            images: images
        });
    });
});

module.exports = router;
