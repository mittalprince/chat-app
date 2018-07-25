const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEYID || 'AKIAJNNGN4G6P2QK4YXQ',
    secretAccessKey: process.env.SECRET_ACCESS_KEY || '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',
    region: process.env.AWS_REGION || 'eu-west-2'
});

const s0 = new AWS.S3({});
const upload = multer({
    storage: multerS3({
        s3: s0,
        bucket: 'uploadgroupimages',
        acl: 'public-read',
        metadata: function(req, file, cb){
            cb(null, {fieldName: file.fieldname});
        },
        key: function(req, file, cb){
            cb(null, file.originalname);
        }
    }),

    rename: function (fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase();
    }
})

exports.Upload = upload;