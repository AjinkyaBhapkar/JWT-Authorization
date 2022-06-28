const  express =require( "express");
const  cors =require( "cors");
const mongoose =require("mongoose");
const path = require('path')

require ('dotenv').config();

const app =express();
const port = process.env.PORT||5000;

app.use(cors());
app.use(express.json());


const uri =process.env.ATLAS_URI;
mongoose.connect(uri,{useNewUrlParser:true});

const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("MongoDB database connected!!!");
})


const userNameRouter = require ('./routes/usersName');


app.use('/userName',userNameRouter);


app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/build', 'index.html'));
});

app.listen(port,()=>{
    console.log(`Server is running on port:${port}`);
});