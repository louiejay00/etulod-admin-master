const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminSchema = new Schema({
  AdminName: String,
  AdminEmail: String,
  AdminPassword: String,
  AdminDateOfBirth: Date,
});

AdminSchema.pre("save", function (next) {
  const admin = this;
  if (admin.isModified("AdminPassword") || admin.isNew) {
    bcrypt.hash(admin.AdminPassword, 10, function (err, hash) {
      if (err) {
        return next(err);
      }
      admin.AdminPassword = hash;
      next();
    });
  } else {
    next();
  }
});
//generateAuthToken
AdminSchema.methods.generateAuthToken = function () {
  const admin = this;
  //you should have an .env file and save the evn variables there
  const token = jwt.sign({ _id: admin._id.toHexString() }, "secret").toString();
  return token;
};

module.exports = {
  default: mongoose.model("Admin", AdminSchema),
  adminSchema: AdminSchema,
};
