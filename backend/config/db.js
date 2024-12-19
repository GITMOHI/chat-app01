const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect("mongodb+srv://mohi:mohi1234@cluster0.becc4nn.mongodb.net/chat-app?retryWrites=true&w=majority&appName=Cluster0",{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })

        console.log(`connected db: ${conn.connection.host}`);
    }catch(err){
        console.log(err.message);
        process.exit();
    }
}

module.exports = connectDB