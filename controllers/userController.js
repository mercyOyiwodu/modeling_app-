const userModel = require('../model/userModel')
const fs = require('fs')

exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const profileImage = req.files.profileImage.filename
        const catalogs = req.files.map((cat) => cat.filename)
        console.log(req.body);
        console.log(req.files); 
        
     
        const user = new userModel({
            name,
            email,
            password,
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
            message: 'User created successfully',
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
            message: 'User created successfully',
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
        if (req.file && req.file.fileName) {
            console.log('if files exists', fs.existsSync(oldFilePath));
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath)
                data.profileImage = req.file.originalname
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

                    console.log('Deleted file:', path);
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
