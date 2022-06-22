import React from "react";
import Admin from "../../../etulod-admin-backend-master/models/Admin";

export interface Admin {
    _id: String;
    AdminName: String;
    AdminEmail: String;
    AdminPassword: String;
    AdminDataOfBirth: String;
  }
const UserContext = React.createContext();

export default UserContext;

