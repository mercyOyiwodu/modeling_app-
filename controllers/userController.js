const userModel = require('../model/userModel')
const fs = require('fs')
const bcrypt =require('bcryptjs')
const {validate} = require('../helper/utilities')
const {registerSchema} =require('../validation/user')

exports.createUser = async (req, res) => {
    try {
        const validatedData = await validate(req.body,registerSchema)
        const { name, email, password } = validatedData;
        console.log(validatedData);
        
        const file = req.files 
        const profileImage = req.files.profileImage[0].filename
        const catalogs = req.files.catalogs.map((cat) => cat.filename)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const user = new userModel({
            name,
            email,
            password: hashedPassword,
            profileImage: profileImage,
            catalogs: catalogs

        })
        
        await user.save()
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        res.status(201).json({
            message: 'User created successfully',
            data: user
        })

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error' + error.message
        })
    }
};

exports.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id)

        if (!user) {
            return res.status(404).json({
                message: 'student not found'
            })
        }
        res.status(201).json({
            message: 'One User below',
            data: user
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error' + error.message
        })
    }
};



exports.getAll = async (req, res) => {
    try {
        const user = await userModel.find()

        if (!user) {
            return res.status(404).json({
                message: 'student not found'
            })
        }
        res.status(201).json({
            message: 'All The Users Below',
            data: user
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error' + error.message
        })
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        const data = {
            name,
            email,
            password,
            profileImage: user.profileImage,
            catalogs: user.catalogs
        }
        const oldFilePath = `./uploads/${user.profileImage}`

        console.log(oldFilePath);
        if (req.files && req.files.fileName) {
            console.log('if files exists', fs.existsSync(oldFilePath));
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath)
                data.profileImage = req.files.originalname
            }
        }

        const oldFilePaths = user.catalogs.map((e) => { return `./uploads/${e}` })
        if (req.files && req.files[0]) {
            oldFilePaths.forEach((path) => {
                if (fs.existsSync(path)) {
                    fs.unlinkSync(path)
                    const files = req.files.map((e) => e.filename)
                    data.catalogs = files
                }
            })
        }
        const updated = await userModel.findByIdAndUpdate(id, data, { new: true })
        res.status(201).json({
            message: 'User updated successfully',
            data: updated
        })

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error' + error.message
        })
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        const deleted = await userModel.findByIdAndDelete(id)
        const oldFilePaths = user.catalogs.map((e) => { return `./uploads/${e}` })

        if (deleted) {
            oldFilePaths.forEach((path) => {
                if (fs.existsSync(path)) {
                    fs.unlinkSync(path)
                }
            })
        }
        const oldFilePath = `./uploads/${user.profileImage}`
        if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath)
        }
        res.status(200).json({
            message: 'user deleted successfully',
            data: deleted
        })

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error: ' + error.message
        })
    }
}
