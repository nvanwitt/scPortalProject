import { combineReducers } from "redux";
import genelist from "./genelist";
import logincheck from "./logincheck";

export default combineReducers({ genelist, logincheck });