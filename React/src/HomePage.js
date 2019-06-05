import './bootstrap/css/bootstrap.css'
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default class Home extends React.Component {
	render() {
		return (
			<div class='home-buttons'>
				<Button bsStyle="success" bsSize="large" block>
				       	<Link to="/Search">Sample Data</Link>
				</Button>
				<Button bsStyle="success" bsSize="large" block>
				       <Link to="/upload">Upload</Link>
				</Button>
			</div>
			)
	}
}
