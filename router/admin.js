const express = require("express");
const router = express.Router();
const validator = require("validator");
//mongo user model
const { default: Admin } = require("./../models/Admin");
//password handler
const bcrypt = require("bcrypt");
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const fs = require('fs');
const path = require('path');
const CronJob = require('cron').CronJob;


// AutoBackUp every week (at 00:00 on Sunday)

new CronJob( 
  '0 0 *  * 0',
  function() {
    dobackupweekly();
  },
  null,
  true,
  'America/New_York'
);

router.get("/", async (req, res) => {
  try {
    const admin = await Admin.find();
    res.status(200).send(admin);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: err.message,
    });
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const isAdminExist = !!(await Admin.findById(req.params.id));

    if (!isAdminExist) {
      throw new Error("User does not exist");
    }

    const update = {
      AdminName: req.body.AdminName,
      AdminEmail: req.body.AdminEmail,
      AdminPassword: req.body.AdminPassword,
      AdminDateOfBirth: req.body.AdminDateOfBirth,
    };
    const doc = await Admin.findByIdAndUpdate(req.params.id, update);
    res.status(200).send(doc);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  // const filter = { _id: req.body._id };
  try {
    let doc = await Admin.findByIdAndDelete(req.params.id);
    res.status(200).send({
      message: `Destination ${id} Deleted`,
    });
  } catch (err) {
    console.log("Error deleting", err);
    res.status(500).send({
      error: err.message,
    });
  }
});
router.get('/databasebackup',async (req,res) => {
  console.log('request all aa gai re backup kar');

  fs.mkdir(path.join(__dirname, 'backup'), (err) => {
    console.log('Directory created successfully!');

    let folderpath = __dirname+ 'backup';
    console.log(folderpath);
        let cmd ='mongodump --uri "mongodb+srv://root:root@cluster0.pkf1s.mongodb.net/myFirstDatabase" -o ' + folderpath;
        console.log(cmd);
            exec(cmd, (error, stdout, stderr) => {
              if(error){
                console.log(error);
              }
              if(stdout){
                console.log(stdout);
              }
              if(stderr){
                console.log(stderr);
              }
            });
            res.end("successfully backedup");

  });

});

router.get('/databaserestore' ,async (req,res) =>{
  let backupdatabaselocation =__dirname+ 'backup/myFirstDatabase --drop';
  console.log(backupdatabaselocation);
  let cmd ='mongorestore --uri "mongodb+srv://root:root@cluster0.pkf1s.mongodb.net/myFirstDatabase" ' +backupdatabaselocation ;
  exec(cmd, (error, stdout, stderr) => {
    if(error){
      console.log(error);
    }
    if(stdout){
      console.log(stdout);
    }
    if(stderr){
      console.log(stderr);
    }
  });
  res.end("successfully restore");
});

router.get("/:id", async (req, res) => {
  const admin = await Admin.findOne({
    id: req.params.id,
  });
  res.status(200).send({
    ...admin._doc,
  });
});

//signup
router.post("/", async (req, res) => {
  try {
  let { AdminName, AdminEmail, AdminPassword, AdminDateOfBirth } = req.body;
  AdminName = AdminName.trim();
  AdminEmail = AdminEmail.trim();
  AdminPassword = AdminPassword.trim();
  AdminDateOfBirth = AdminDateOfBirth.trim();
  
  if (
  AdminName == "" ||
  AdminEmail == "" ||
  AdminPassword == "" ||
  AdminDateOfBirth == ""
  ) {
  return res.status(400).json({
  status: "FAILED",
  message: "Empty input fields!",
  });
  }
  if (!/^[a-zA-Z ]*$/.test(AdminName)) {
  return res.status(400).json({
  status: "FAILED",
  message: "Invalid name entered",
  });
  }
  if (!validator.isEmail(AdminEmail)) {
  return res.status(400).json({
  status: "FAILED",
  message: "Invalid email entered",
  });
  }
  if (AdminPassword.length < 8) {
  return res.status(400).json({
  status: "FAILED",
  message: "Password too short",
  });
  }
  
  let admin = await Admin.findOne({ AdminEmail });
  if (admin) {
  return res.status(400).json({
  status: "FAILED",
  message: "Admin with the provided email already exists",
  });
  }
  
  let result = await new Admin({
  AdminName,
  AdminEmail,
  AdminPassword,
  AdminDateOfBirth,
  }).save();
  
  return res.status(200).json({
  status: "SUCCESS",
  message: "Signup successful",
  data: result,
  });
  } catch (ex) {
  return res.status(200).json({
  status: "FAILED",
  message: ex.message,
  });
  }
  });

//signin
router.post("/signin", async (req, res) => {
  try {
    let { AdminEmail, AdminPassword } = req.body;
    AdminEmail = AdminEmail.trim();
    AdminPassword = AdminPassword.trim();
console.log("yahamsansmansm");
    if (AdminEmail == "" || AdminPassword == "") {
      return res.status(400).json({
        status: "FAILED",
        message: "Empty credentials supplied",
      });
    }
    let admin = await Admin.findOne({ AdminEmail });
    if (!admin) {
      return res.status(401).json({
        status: "FAILED",
        message: "Invalid credentials supplied",
      });
    }
    //comparing passwords
    const isPasswordValid = await bcrypt.compare(
      AdminPassword,
      admin.AdminPassword
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "FAILED",
        message: "Invalid credentials supplied",
      });
    }
    //generating jwt
    const token = admin.generateAuthToken();
    return res.status(200).json({
      status: "SUCCESS",
      message: "Signin successful",
      token,
      data: admin,
    });
  } catch (ex) {
    console.log(
"yaha aaya kya"
    )
    return res.status(500).send({
      message: ex.message,
    });
  }
});


function dobackupweekly(){
  fs.mkdir(path.join(__dirname, 'backup'), (err) => {
    console.log('Directory created successfully!');
    let folderpath = __dirname+ 'backup';
    console.log(folderpath);
        let cmd ='mongodump --uri "mongodb+srv://root:root@cluster0.pkf1s.mongodb.net/myFirstDatabase" -o ' + folderpath;
        console.log(cmd);
            exec(cmd, (error, stdout, stderr) => {
              if(error){
                console.log(error);
              }
              if(stdout){
                console.log(stdout);
              }
              if(stderr){
                console.log(stderr);
              }
            });
  });
}

module.exports = router;


// "start": "react-scripts start",