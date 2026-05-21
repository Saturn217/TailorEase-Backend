const cloudinary = require('cloudinary').v2
 const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')
const AppError = require('./AppError')


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const OrderStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'tailorease/orders',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1000, quality: 'auto' }]
    }
})


const companyStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'tailorease/companies',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 500, quality: 'auto' }]

    }
})

const uploadOrdersImage = multer({
    storage: OrderStorage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new AppError('Only image files are allowed', 400), false)  
        }
    }
})


const uploadCompanyImage = multer({
    storage: companyStorage,
    limits:{
        fileSize: 2 * 1024 * 1024
    },
    fileFilter:(req, file, cb)=>{
        if(file.mimetype.startsWith('image/')){
            cb(null, true)
        }
        else{
            cb(new AppError('Only image files are allowed', 400), false)
        }
    }

})

module.exports = {cloudinary, uploadOrdersImage, uploadCompanyImage}