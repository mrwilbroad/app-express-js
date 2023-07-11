const fs = require("node:fs");
const fspromises = require("node:fs/promises");
const path = require("node:path");
const cookieparser = require("cookie-parser");


// middleware section
const logger = (req,res,next)=>{
    const method = req.method;
    const url = req.originalUrl;
    const timeT = new Date().toDateString();

    console.log(`Request at ${req.ip}-----------${method},${url}, ${timeT}, ${Date.now()} secs}`)
    // res.send("testing")
    next();
}



const errorMiddleware = (err,req,res,next)=> {
     console.log(err.stack);
     res.status(500).send("Internal server error");
}

// application Error Logger
 const Errorlogger = async (error)=>{
    
    const fpath = path.join(__dirname);
    try {
        if(!fs.existsSync(path.join(fpath,"logs")))
    {
        await fspromises.mkdir(path.join(fpath,"logs"));
    }
    console.error(error);
    const timer = new Date();
    const uuid = `${Date.now()}-c3f3-4bb4-950f-${Date.now()}`;
    const content = `${error}, ${uuid}-${timer}\n\n`;
    const logspath = path.join(fpath,"logs","logs.log");
    fspromises.appendFile(logspath,content,{
        encoding: "utf-8"
    })

    }catch(err){
        console.error(`${err}\nSee error in logs file for more information`)
    }

}



const MiddlewareTimer = [cookieparser(),logger,errorMiddleware]
module.exports = {
    MiddlewareTimer:MiddlewareTimer,
    Errorlogger: Errorlogger
}