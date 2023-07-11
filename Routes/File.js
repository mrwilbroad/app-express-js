const path = require("node:path");
const fs = require("node:fs");
const fspromises = require("node:fs/promises");
const express = require("express");
const { MongoDbClient} = require("./../database/mongodbdatabase");
const { time } = require("node:console");
const mtonganihospital = MongoDbClient.db("mtonganihospital");
const collection = mtonganihospital.collection("Filemanager");
const FileRoutes = express.Router();


// Files
    FileRoutes.get("/",async(req,res)=> {
        try {
            
            const data = await collection.find().toArray();
            res.status(200).json(data);
            
        }catch(error){
            console.log(`Error  : ${error.stack.toString()}`);
            res.status(500).send("Internal Server error.....");
        }
    })

FileRoutes.post("/",async(req,res)=>{
    try {
        const { clientFile} = req.files;
        let allowedExt = ['jpg','jpeg','png'];
        // pptx
        var files = clientFile.name.split(".");
        var exType = files[files.length-1];
        if(!allowedExt.includes(exType)){

            res.status(422).json({
                "clientFile": "File Extension is not Allowed"
            })
        }else {
            
             if(!fs.existsSync(path.join(__dirname,"storage")))
             {
                await fspromises.mkdir(path.join(__dirname,"storage"));
             }
             const filename = `${(Date.now())}.${exType}`;
             const fspath = path.join(__dirname,"storage",`${filename}`);
             await fspromises.writeFile(fspath,clientFile.data);
             const isInserted = await collection.insertOne({
                id: (Date.now),
                path: `http://localhost:7898/${filename}`
             })
            if(isInserted.acknowledged)
            {
                res.status(200).json({
                    "message":"File is successfull sent"
                });
            }else {
                res.status(422).json({
                    "message":"File not served!Try again"
                });
            }
        }
        // res.send(clientFile);
    }catch(error){
        console.log(`Error  : ${error.stack.toString()}`);
        res.status(500).send("Internal Server error.....");
    }
})



module.exports = FileRoutes;
