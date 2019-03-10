import 'bootstrap/css/bootstrap.css'
import React from 'react';
import {Panel} from 'react-bootstrap';

export default class StatusBar extends React.Component {
	render() {
		return(
			<Panel bsStyle="primary">
	    		<Panel.Heading>
	      			<Panel.Title componentClass="h3">Status</Panel.Title>
	    		</Panel.Heading>
	    		<Panel.Body>
	    		{this.props.status}
	    		<ol>{this.props.moves}</ol>
	    		</Panel.Body>
  			</Panel>
			)
	}


}