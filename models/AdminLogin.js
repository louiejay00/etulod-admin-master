const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminLoginSchema = new Schema({
  AdminEmail: String,
  AdminPassword: String,
});

module.exports = {
  default: mongoose.model('Admin', AdminLoginSchema),
  adminloginSchema: AdminLoginSchema,
}
