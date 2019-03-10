// Routes.js
import React from 'react';
import { Route, Switch } from 'react-router-dom'
import Portal from './Portal';
import Home from './HomePage';
import UploadForm from './UploadFile';
import GoogleLogin from './Login';

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

export default class Routes extends React.Component {
	render(){
		return (
			<Switch>
				<Route exact path="/" component={Home}/>
				<Route exact path="/login" component={GoogleLogin}/>
				<Route exact path="/Search" component={Portal}/>
			    <Route path="/About" component={About}/>
			    <Route path="/upload" component={UploadForm}/>
			</Switch>
			)
	}
}