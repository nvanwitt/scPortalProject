import './bootstrap/css/bootstrap.css'
import React from 'react';
// import Select from 'react-select'
import AsyncSelect from 'react-select/lib/Async';
import {Button, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, Checkbox} from 'react-bootstrap';

export class GeneElement extends React.Component {
	render() {
		return(
			<li >
				<Checkbox>
			    <Button bsStyle="success">
			       	{this.props.gene}
			    </Button>
			    <Button bsStyle="success" onClick={() => this.props.onRemove(this.props.index)}>
			       	Remove
			    </Button>
			    </Checkbox>

		     </li>
			)
		}
}
export class GeneList extends React.Component {

	render() {
		var displaygenes = this.props.genes.map((gene, index) => {
			return(
		        <GeneElement 
		        key={index}
		        index={index} 
		        gene={gene} 
		        onRemove={this.props.onRemove} 
		        />
		     );
		    });
	    return (
	    	<ul class="list-unstyled" > {displaygenes} </ul>
	    	)
	    }
	}

export default class OptionsBar extends React.Component {

	render() {

		return (
		<div>
			<Panel bsStyle="primary">
	    		<Panel.Heading>
	      			<Panel.Title componentClass="h3">Options</Panel.Title>
	    		</Panel.Heading>
	    		<Panel.Body>
	    			<form>
				        <FormGroup
				          controlId="formBasicText"
				        >
				          <ControlLabel>Markers</ControlLabel>
				          <AsyncSelect
						     value='None'
						     cacheOptions
						     loadOptions={this.props.geneSearch} 
						     placeholder='Search genes...' 
						     closeMenuOnSelect='True'
						     onChange={this.props.onChange}
						  />
						  <HelpBlock>Select genes to visualize...</HelpBlock>
						  <GeneList genes={this.props.geneChoices} onRemove={this.props.removeGene} />
				          <FormControl.Feedback />
				          
				        </FormGroup>
				        <FormGroup>

				        </FormGroup>
				      </form>

	    		</Panel.Body>
  			</Panel>
  			<div>
  			</div>
  		</div>
			)
	}
}
