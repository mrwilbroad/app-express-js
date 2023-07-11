const express =require("express");
const path = require("node:path");
const fs = require("node:fs");
const fileUpload = require("express-fileupload");
const {MiddlewareTimer, Errorlogger} = require("./middleware/logger");
const testrouter = require("./Routes/student");
const cors = require("cors");
const bordparser = require("body-parser");
const FileRoutes  = require("./Routes/File");

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(bordparser.json());


const port = 7898;
app.use(MiddlewareTimer);
app.use(express.urlencoded({
    extended: false
}))

const fpath = path.join(__dirname,"Routes","storage");
app.use(express.static(fpath));

// route api/test
app.use('/students',testrouter);

// /File/
app.use("/File",FileRoutes);

// setting static and middleware
const styledir = path.join(__dirname,"library","Bootstrap");
const storagedir = path.join(__dirname,"library","resources");
app.use(express.static(styledir,{
    maxAge:64000
}));

app.use(express.static(storagedir));
app.get("/", (req,res)=> {
    // res.clearCookie("ihacookie");  clear cookie
    //  const apppath = path.join(__dirname,"library","index.html");
    //  const FileReadStream = fs.createReadStream(apppath, {
    //     highWaterMark: 1024
    //  });
    //  FileReadStream.pipe(res.status(200));
         res.status(200).send("HOME GROUND");
});

app.get("/test/:id?", (req,res)=> {
    var {id} = req.params;
     const {name,school} = req.query;
     res.json(FetchData())

})


// for all 404 page
app.all("*",(req,res) => {
    Errorlogger(`***********NOT FOUND: Request from ${req.ip} on ${req.method} ${req.url} ${ (new Date())}`)
    res.status(404).json({
        status: "error",
        message: "Resource not found"
    })
})



const server = app.listen(port,()=> {

    const host = server.address().address;
    const portNo = server.address().port;
    console.log(`INFO: Server running on ${host}:${portNo}`);
})


