const router = require('express').Router()
const { createUser , getAll, getOne, updateUser, deleteUser} = require('../controllers/userController')
const upload = require('../utils/multer')


router.post('/user',upload.single('profileImage'),upload.array('catalogs',5),createUser)
router.get('/user',getAll)
router.get('/user/:id',getOne)
router.patch('/user/:id',upload.single('profileImage'),upload.array('catalogs',5),updateUser)
router.delete('/user/:id',deleteUser)





module.exports= router
