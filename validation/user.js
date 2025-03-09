const joi = require('joi')

exports. registerSchema = joi.object().keys({
    name : joi.string().min(3).max(20).required(),
    email : joi.string().trim().email().required(),
    password : joi.string().trim().min(6).required(),
    // profileImage : joi.string().min(1).required(),
    // catalogs :joi.string().min(5).required()
})