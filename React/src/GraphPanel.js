import 'bootstrap/css/bootstrap.css'
import React from 'react';
import { Panel } from 'react-bootstrap';


//TODO: 
// -Bring up script into own component and render the same way. Use if/else to prevent duplicate plots.



export default class GraphPanel extends React.Component {
	
	componentDidUpdate () {

		if (this.props.plotStatus === 'pending') {
			console.log("Over here")
			const plotScript = document.createElement("script");
			// console.log(document.getElementById('bokehplot'))
			const plotDiv = document.getElementById('bokehplot')

			plotScript.src = this.props.bokehPlotSrc
		    plotScript.id = this.props.bokehPlotId

		    if (plotDiv.childNodes[1]) {
		    	console.log('Replacing Node....')
				plotDiv.replaceChild(plotScript, plotDiv.childNodes[1])
				console.log('Node Replaced.')
				console.log('Checking Replacement Plot Status:')
				console.log(this.props.plotStatus)
		    } else {
		    	plotDiv.appendChild(plotScript)
		    	//this.props.setplotStatus()
		    	console.log('Checking Initial Plot Status:')
				console.log(this.props.plotStatus)
		    }
		    this.props.setplotStatus()

		}

    }

	render() {
		//this.updateDoc()
		return (
			<Panel bsStyle="primary">
	    		<Panel.Heading>
	      			<Panel.Title componentClass="h3">Display</Panel.Title>
	    		</Panel.Heading>
	    		<Panel.Body>
	    			<div id="bokehplot"> </div>
	    		</Panel.Body>
  			</Panel>

			)
	}
}