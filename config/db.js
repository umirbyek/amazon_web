const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URL, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
   
    // useUnifiedTopology: true,
  }).then(()=>console.log(`DB Ok :${mongoose.connection.host}`.cyan.underline.bold)).catch(err => console.log(err+"Aldaa"));

  console.log(`Mongo DB holbogdloo: ${conn}`);
};

module.exports = connectDB;
