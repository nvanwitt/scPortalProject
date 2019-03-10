import 'bootstrap/css/bootstrap.css'
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import StatusBar from './StatusBar.js';
import OptionsBar from './OptionsBar.js';
import GraphPanel from './GraphPanel.js';
import { addGene } from './redux/actions';
import { connect } from 'react-redux';
import './index.css';


var selectedOption = [];


export class Portal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: selectedOption,
      currentChoice: [],
      curBokehSrc: "",
      curBokehId: "",
      bokehPlotSrc: "",
      bokehPlotId: "",
      plotStatus: false,
      plot: "",
      dataset: "None",
    };
    this.setPlotStatus = this.setPlotStatus.bind(this);
    this.searchGenes = this.searchGenes.bind(this);

  }


  componentDidMount () {
    //store.subscribe(() => this.forceUpdate());
    console.log('Locating dataset...')
    //console.log(this.props.location.state)
    if (this.props.location.state) {
      this.setState({
        dataset: this.props.location.state.dataset
      })
    }

    console.log('Mounting main comp')
    if (this.state.plotStatus === false){
      this.fetchBokeh()
    }
  }

  async searchGenes(searchKey) {
    const rawResponse = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'searchKey': searchKey, "dataset": this.state.dataset})
    });
    var content = await rawResponse.json()
    const genelist = content.map(opt => ({ label: opt, value: opt }))
    return genelist
  }


  fetchBokeh(genesList=['None'], state= this.state.plotStatus) {
      fetch('/api/bokeh', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"plotKey": "Tier1", "plotGene": genesList, "dataset": this.state.dataset})
      }).then(rawResponse => (rawResponse.json())).then(jsonStr => {
        this.setState({
          bokehPlotSrc: jsonStr.plotsrc,
          bokehPlotId: jsonStr.plotid,
          plotStatus: 'pending'
        })
      })
    }
  
  setPlotStatus() {
    this.setState({
      plotStatus: true,
      curBokehSrc: this.state.bokehPlotSrc,
      curBokehId: this.state.bokehPlotId
    });
  }

// Option Bar Functions -----------------------------------
// NOTE: react-select component returns object {label, value}, must select either/or

  handleChange(value) {
    console.log('HERE')
    //store.dispatch(addGene(value.label))
    this.props.addGene(value.label)
    this.state.currentChoice.push(value.label)
    this.setState({
      currentChoice: this.state.currentChoice});
    this.fetchBokeh(this.state.currentChoice)
  }

// Remove gene from list and fetch new Bokeh plot
  removeGene (gene) {
    var geneArray = [this.state.currentChoice] // make a separate copy of the array
    this.state.currentChoice.splice(gene, 1);
    this.setState({
      currentChoice: this.state.currentChoice});
    this.fetchBokeh(this.state.currentChoice)
  }

// Render Space ------------------------------------------
  render() {
    console.log(this.props)
    const PlotSrc = this.state.bokehPlotSrc;
    const PlotId = this.state.bokehPlotId;
    const search = this.searchGenes;
    const choices = this.state.currentChoice;
    const setPS = this.setPlotStatus;
    //const geneStore = this.props.store.getState().selectedGenes;
    //console.log(geneStore)
    const genes = choices.map((gene, index) => {
      return(
        <li key={index} >
          <Button bsStyle="success">
            {gene}
          </Button>
        </li>
        );
    });

    return (
      <div>
      <div className="game">
        <div className="options-bar">
          <OptionsBar 
            onChange={(value) => this.handleChange(value)}
            geneChoices={choices}
            removeGene={(gene) => this.removeGene(gene)}
            geneSearch={search}
          />
        </div>
        <div className="graph-panel">
        <GraphPanel 

          geneChoices={choices}
          curScript={this.state.curBokehSrc}
          curId={this.state.curBokehId}
          bokehPlotSrc={PlotSrc}
          bokehPlotId={PlotId}
          plotStatus={this.state.plotStatus}
          setplotStatus={() => setPS()}
        />
        </div>
        <div className="status-bar">
          <StatusBar />
        </div>
      </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state)
  return { 
    geneCollection: state.genelist.selectedGenes,
   }
}

function mapDispatchToProps(dispatch){
  return {
    addGene: (gene) => dispatch(addGene(gene))
  }
}

export default connect( mapStateToProps, { addGene} )(Portal)