const express = require("express");

const dotenv = require("dotenv");
var path = require("path");
var rfs = require('rotating-file-stream')

const colors= require("colors")

const connectDB=require('./config/db')
 
const fileupload=require("express-fileupload")
const errorHandler=require("./middleware/error")
const injectDb=require('./middleware/injectDb')
///app proceess env run
dotenv.config({ path: './config/config.env' });

const db=require('./config/db-mysql')

connectDB();

var morgan = require("morgan");
const logger = require("./middleware/logger");


//router import
const categoriesRoutes = require("./routes/categories");
const booksRoutes = require("./routes/books");
const usersRoutes = require("./routes/users");
const { slugify } = require("transliteration");

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
  })

const app = express();
//route

//body parser

app.use(express.json())
app.use(fileupload())
app.use(logger);
app.use(injectDb(db))
app.use('/api/v1/categories',categoriesRoutes)
app.use('/api/v1/books',booksRoutes)
app.use('/api/v1/users',usersRoutes)
app.use(errorHandler)

app.use(morgan('combined', { stream: accessLogStream })
);



db.sequelize.sync().then(result=>{

  console.log('syn chiigldee');
}).catch((err)=>console.log(err))

const server=app.listen(
  process.env.PORT,
  console.log(`Express ${process.env.PORT} port deer aslaa`)
);

process.on('unhadled Rejection',(err,promise)=>{
  console.log(`Aldaaa garlaa :${err.message}`);
  server.close(()=>{
    process.exit(1)
  })
})