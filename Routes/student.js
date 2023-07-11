const { MongoDbClient } = require("./../database/mongodbdatabase");
const express = require("express");
const testrouter = express.Router();
const { Errorlogger} = require("./../middleware/logger");
const { ObjectId } = require("mongodb");

const bookstore = MongoDbClient.db("bookstore");
const collection = bookstore.collection("student");

// route api/test/*
testrouter.get("/", async(req,res)=> {
    try {
    var { count } = req.query;
    const patt = /^[0-9]+$/;
    var no = 100;
    if(patt.test(count))
    {
        count = Number(count);
        count = count> 100? no: count;

    }else {
        count = no;
    }
    
    const data = await collection.find().limit(count).sort({
        _id:-1
    }).toArray();
    res.status(200).json(data);
    
    }catch(error){

        Errorlogger(error.stack.toString())
        res.status(500).json({
            status:"error",
            message: error.toString()
        })
    }
})


// students/:id
// delete operation
testrouter.get("/:id", async(req,res)=> {
   
    var { id } = req.params;
    try {
         id = validId(id);
        const student = await collection.findOne({
            _id:new ObjectId(id)
        })
        res.status(200).json(student);
    }catch(error){
        Errorlogger(error.stack.toString())
        res.status(500).json({
            status:"error",
            message: error.toString()
        })
    }
})


// db..find
testrouter.post("/", async(req,res)=> {
      try {
        var { fname,mname,lname,gender,collegeName,courseName,yos} = req.body;
        if(fname == undefined || fname == ""||
           lname == undefined || lname == ""||
           mname == undefined || mname == "" ||
           gender == undefined || gender == "" ||
           collegeName == undefined || collegeName == ""||
           courseName == undefined || courseName == "" ||
           yos == undefined || yos == ""
           ){
            res.status(422).json({
                status: "error",
                message: "Fill all requred data accodingly!"
            })
           }else {

            const SavedData = {
                fname: fname,
                mname: mname,
                lname: lname,
                gender: gender,
                collegeName: collegeName,
                courseName: courseName,
                yos: yos
            }
        const studentData = await collection.findOne(SavedData);
        if(studentData){
            res.status(200).json({
                data: studentData,
                status: true,
                message: "This student already saved"
            });
        }else {
            const isInserted = await collection.insertOne(SavedData);
        if(isInserted.acknowledged)
        {
            res.status(201).json({
                status: true,
                message: "Client data is successfull inserted ..."
            });
        }else {
            res.status(422).json({
                status: false,
                message: "Please try again!"
            });
        }
        }
    
       
    }
      }catch(error){
        Errorlogger(error.stack.toString())
        res.status(500).json({
            status:"error",
            message: "Internal server error "
        })
      }

})


// delete operation
testrouter.delete("/:id", async(req,res)=> {
   
    try {
        var { id} = req.params;
        const isInserted = await collection.deleteOne({
            _id:new ObjectId(validId(id))
        })
        var result = {};
        if(isInserted.deletedCount > 0)
        {
            result = {
                status: "success",
                message: "student is successfull deleted"
            }
        }else if(isInserted.acknowledged && isInserted.deletedCount <=0){
            result = {
                status: "error",
                message: "Student not found.."
            }
        }else {
            result = {
                status: "error",
                message: "Delete operation fail.."
            }
        }
        res.status(200).json(result);

    }catch(error){
        Errorlogger(error.stack.toString())
        res.status(420).json({
            status:"error",
            message: "student details not found!"
        })
    }
})


testrouter.patch("/:id",async(req,res)=> {
     try {
        var { id } = req.params;
        id = validId(id);
        var { fname,mname,lname,gender,collegeName,courseName,yos} = req.body;
        if(fname == undefined || fname == ""||
           lname == undefined || lname == ""||
           mname == undefined || mname == "" ||
           gender == undefined || gender == "" ||
           collegeName == undefined || collegeName == ""||
           courseName == undefined || courseName == "" ||
           yos == undefined || yos == ""
           ){
            res.status(422).json({
                status: "error",
                message: "Fill all requred data accodingly!"
            })
           }else {
              const IsUpdated = await collection.updateOne({
                _id: new ObjectId(id)},{
                    $set: {
                        fname: fname,
                        mname: mname,
                        lname: lname,
                        gender: gender,
                        collegeName: collegeName,
                        courseName: courseName,
                        yos: yos
                    }
                });

                if(IsUpdated.modifiedCount > 0){
                    res.status(200).json({
                        status: "success",
                        message: "Student details are successfull updated!"
                    })
                }else {
                    throw new Error(`ERROR:user Record for Request seems not Found! REQUEST DETAILS ${req}`);
                }
           }

     }catch(error){
        Errorlogger(error.stack.toString());
        res.status(422).json({
            status: "error",
            message: "Student details not found for this user!"
        })
     }
})


const validId =(id)=> {
     const pattern = /^[0-9a-fA-D]{24}$/;
     if(!pattern.test(id)){
        throw new Error(`[${id}] being sent from request is not valid ObjectId as required!`);
     }

     else {
        return id;
     }
}

// for all 404 page
testrouter.all("*",(req,res) => {

    Errorlogger(`***********NOT FOUND: Request from ${req.ip} on ${req.method} ${req.url} ${ (new Date())}`)
    res.status(404).json({
        status: "error",
        message: "No students record!"
    })
})



module.exports = testrouter;