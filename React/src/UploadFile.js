import React from 'react';
import { Button, Modal, FormGroup, FormControl, ControlLabel, HelpBlock, Radio } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

export default class UploadForm extends React.Component {
	constructor(props, context) {
	    super(props, context);

	    this.handleHide = this.handleHide.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	    this.handleSelect = this.handleSelect.bind(this);
	    this.handleText = this.handleText.bind(this);
	    this.fileInput = React.createRef();
	    this.radioSelection = React.createRef();

	    

	    this.state = {
	      show: true,
	      redirect: false,
	      submitState: false,
	      matrixType:'None',
	      directoryReq: "false",
	      setName: ''
	    };
	 }

	 handleHide() {
	    this.setState({ show: false });
	    this.setState({redirect: true})
	 }

	 handleText(name) {
	 	this.setState({
	 		setName: name.target.value
	 	})
	 }

	 handleSelect(select) {
	 	this.setState({ matrixType: select.target.id });
	 	if (select.target.id  === '10x') {
	 		this.directorySelect = 
	 		<div>
	 		<ControlLabel>Dataset Matrix</ControlLabel>
	 		<input type="file" ref={this.fileInput} webkitdirectory='true' />
	 		<HelpBlock>Please select directory with matrix.mtx, barcodes.tsv, and genes.tsv</HelpBlock>
	 		</div>;
	 	} else {
	 		this.directorySelect = 
	 		<div>
	 		<ControlLabel>Dataset Matrix</ControlLabel>
	 		<input type="file" ref={this.fileInput} />
	 		<HelpBlock>Please upload matrix in .xlsx format</HelpBlock>
	 		</div>;
	 	}
	 }

	 handleSubmit(formResponse) {
	 	formResponse.preventDefault();
	 	console.log(this.state.matrixType)
	 	console.log(this.state.setName)
	 	console.log(this.fileInput.current)
	 	if (this.state.matrixType === 'SS2' && this.fileInput.current.files[0]) {
	 		const file = this.fileInput.current.files[0]
	 		const name = this.fileInput.current.files[0].name
	 		const formData = new FormData();
		 	formData.append(name, file)
		 	console.log(formData.get(this.fileInput.current.files[0].name))


		 	fetch('/api/upload', {
		        method: 'POST',
		        'Content-Type': 'multipart/form-data',
		        body: formData
	      	}).then( (response) =>  {if (response.status === 203) {
	      		this.setState({submitState: true})
	      	} else {
	      		console.log(response.status)
	      	}
	      	}	)
	      	

	 	} else if (this.state.matrixType === '10x'){
	 		const formData = new FormData();
	 		formData.append('dataset', this.state.setName)
		 	formData.append(this.fileInput.current.files[0].name, this.fileInput.current.files[0])
		 	formData.append(this.fileInput.current.files[1].name, this.fileInput.current.files[1])
		 	formData.append(this.fileInput.current.files[2].name, this.fileInput.current.files[2])
	 		console.log(formData.get(this.fileInput.current.files[0].name))
	 		console.log(formData.get(this.fileInput.current.files[1].name))
	 		console.log(formData.get(this.fileInput.current.files[2].name))
	 		fetch('/api/upload', {
		        method: 'POST',
		        'Content-Type': 'multipart/form-data',
		        body: formData
	      	}).then( (response) =>  {

		      	if (response.status === 203) {
		      		this.setState({submitState: true})
		      	} else {
		      		console.log(response.status)
		      	}
	      	})

	 	} else {
	 		console.log('No File')
	 		return 
	 	}
	 }

	render() {
		if (this.state.redirect === true) {
			return <Redirect push to="/" />;
		}

		if (this.state.submitState === true) {
			return <Redirect push to={{ pathname: "/Search", state: { dataset: this.state.setName }}}/>;
		}

		return (
			<div class='upload-form'>
				<Modal show={this.state.show} onHide={this.handleHide}>
					<form onSubmit={this.handleSubmit} encType="multipart/form-data ">
					    <Modal.Header>
					      <Modal.Title>Custom Data</Modal.Title>
					    </Modal.Header>

					    <Modal.Body>
					    Please fill out the following items to start examining your dataset...
				    	
				    		<FormGroup controlId="formControlsText" >
						      <ControlLabel>Dataset Name</ControlLabel>
						      <FormControl type="text" name="inText" value={this.state.setName} onChange={this.handleText}/>
						      <HelpBlock>Enter dataset name...</HelpBlock>
						    </FormGroup>

						    <ControlLabel>Select Data Type:</ControlLabel>
						    <FormGroup controlId="formControlsText" >
						      <Radio name="radioGroup" id='SS2' onChange={this.handleSelect} inline>
						        SS2
						      </Radio>{' '}
						      <Radio name="radioGroup" id='10x' onChange={this.handleSelect} inline>
						        10x
						      </Radio>{' '}
						    </FormGroup>

						    <FormGroup controlId="formControlsFile" >
						      	{this.directorySelect}
						    </FormGroup>

					    </Modal.Body>

					    <Modal.Footer>
					      <Button onClick={this.handleHide}>
					      	Close
					      </Button>
					      <Button bsStyle="primary" type='submit'>
					      	Save changes
					      </Button>
				    	</Modal.Footer>
				  	</form>
				</Modal>
			</div>
		)
	}
}