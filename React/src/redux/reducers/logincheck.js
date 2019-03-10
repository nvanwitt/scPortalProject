import { LOGIN_CHECK } from '../actionTypes';

const initialState = {
  loginStatus: false,
  loginName: null,
  loginPic: null
};

export default function(state = initialState, action) {
  console.log(action.payload)
	switch (action.type) {
    case LOGIN_CHECK: {
      return {
        ...state,
        loginStatus: true,
        loginName: action.payload.login.name,
        loginPic: action.payload.login.picture
       };
     }
    default:
      return state;
    }
      
}