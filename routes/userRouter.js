const router = require('express').Router()
const { createUser , getAll, getOne, updateUser, deleteUser} = require('../controllers/userController')
const upload = require('../utils/multer')


router.post('/user',upload.fields([{name: 'profileImage'},{name: 'catalogs'}]),createUser)
router.get('/user',getAll)
router.get('/user/:id',getOne)
router.patch('/user/:id',upload.fields([{name: 'profileImage'},{name: 'catalogs'}]),updateUser)
router.delete('/user/:id',deleteUser)





module.exports= router
