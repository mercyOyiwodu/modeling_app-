const mongoose = require('mongoose')
require('dotenv').config()
const db = process.env.MONGO_DB

mongoose.connect(db)
.then(()=>{
    console.log('Connection to the database has been established successfully');
    
})
.catch((error)=>{
    console.log('Error connecting to database', error.message);
                                                                                                                            
})