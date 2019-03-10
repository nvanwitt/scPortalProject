/* global gapi */
/* global googleyolo */
import React from 'react';
import { loginCheck } from './redux/actions';
import { connect } from 'react-redux';


export class GoogleLogin extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	lgDisplay: false
	    };
	    this.setLoginDisplay = this.setLoginDisplay.bind(this);
	    this.newSignIn = this.newSignIn.bind(this);
	    this.onSignOut = this.onSignOut.bind(this);
	    

	  }

	componentDidMount () {
		
		if (this.state.lgDisplay === false) {
			const gapiScript = document.createElement("script");

			gapiScript.src = "https://apis.google.com/js/platform.js" 
			gapiScript.onload = () => {this.newSignIn()}
			gapiScript.async = true
			gapiScript.defer = true

			document.body.appendChild(gapiScript);

			this.setLoginDisplay();
		}
	}

	setLoginDisplay () {
		this.setState({
			lgDisplay: true
		});
	}



	newSignIn() {
		var loginCheck = this.props.loginCheck;
		gapi.load('client:auth2', function() { 
			gapi.auth2.authorize({
			  client_id: "396412765555-9h6iue2qkl0kje9fv3crgvldg2rebmru.apps.googleusercontent.com",
			  scope: 'email profile openid',
			  response_type: 'id_token permission'
			}, function(response) {
			  if (response.error) {
			    // An error happened!
			    return;
			  }
			  // The user authorized the application for the scopes requested.
			  var accessToken = response.access_token;
			  var idToken = response.id_token;

			  fetch('/api/validate', {
			        method: 'POST',
			        headers: {
			          'Accept': 'application/json',
			          'Content-Type': 'application/json'
			        },
			        body: JSON.stringify({"idToken": idToken})
		      	}).then((response) =>  (response.json())).then(jsonstr => {loginCheck(jsonstr)})
			});
		})
	}



	onSignOut() {
		console.log('In Here')
		var gInstance = gapi.auth2.getAuthInstance()
		console.log(gInstance.currentUser.get())
		gInstance.signOut()
	}


	render() {
		return (
			<div id="google-signin">
				<button id='signInGoogleButton'>Sign In</button>
				<button id='myGoogleButton' onClick={this.onSignOut}>Sign Out</button>
			</div>
			)
	}
}

function mapDispatchToProps(dispatch){
  return {
    loginCheck: (event) => dispatch(loginCheck(event))
  }
}

export default connect( null, mapDispatchToProps )(GoogleLogin)