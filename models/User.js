const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  dateOfBirth: Date,
});

module.exports = {
  default: mongoose.model("User", UserSchema),
  userSchema: UserSchema,
};
