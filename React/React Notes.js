React Notes

To use React classes in different files you must export the React class:

export default class App extends React.Component {
  render () {
    return <p> Hello React!</p>;
  }
}

export class BokehPlot extends React.Component {

	render() {
		return null
	}

}

To use props from upstream components you must surround the call to props in brackets {}
	{this.props."prop"}


Webpack abstracted away with create-react-app
For production build -> npm run build

For dev:
To set up a backend for development you must use create-react-apps embedded webpack proxy
in packages.json add -> proxy": "http://localhost:5000" or location of server.
	-fetch requests to http://localhost:5000/extensions will be identified by webpack

One of reacts life-cycle functions, can use to load things on first page.
componentDidMount() {
    GeneReq.search((response) => {
      this.setState({
        glist: response
      })
    });
  }

  componentDidMount() {
    GeneReq.search((response) => {
      response = response.map(opt => ({ label: opt, value: opt }))
      console.log(Object.values(response)[0])
      this.setState({
        glist: response
      })
    });
  }

const thing = async(searchKey) => {
      const rawResponse = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'searchKey': searchKey})
      });
      var content = await rawResponse.json()
      console.log(content);
      const genelist = content.map(opt => ({ label: opt, value: opt }))
      return genelist
    }


To load Bokeh files, need to set up server on chrome. By default chrome prevents local file access for security reasons.
	componentDidMount () {

		    const plotScript = document.createElement("script");
	        plotScript.src = "http://127.0.0.1:8887/testBokeh.js";
	        plotScript.id = "390125dd-6f3d-4708-9cbd-abe959573b64"
	        plotScript.setAttribute("data-bokeh-model-id", "47a1dbab-a018-4a8a-983e-61475baafe8c")
	        plotScript.setAttribute("data-bokeh-doc-id", "50e650c3-722d-4174-9ba9-d93093fa437b")

	        document.body.appendChild(plotScript);

	            	const bokehCss = document.createElement("link");
	    bokehCss.href = "http://cdn.pydata.org/bokeh/release/bokeh-0.13.0.min.css"
	    bokehCss.rel = "stylesheet"
	    bokehCss.type = "text/css"
	    document.body.appendChild(bokehCss);

    	const bokehWCss = document.createElement("link");
	    bokehWCss.href = "http://cdn.pydata.org/bokeh/release/bokeh-widgets-0.13.0.min.css"
	    bokehWCss.rel = "stylesheet"
	    bokehWCss.type = "text/css"
	    document.body.appendChild(bokehWCss);

	    const bokehSrc = document.createElement("script");
	    bokehSrc.src = "http://cdn.pydata.org/bokeh/release/bokeh-0.13.0.min.js"
	    bokehSrc.type = "text/javascript"
	    document.body.appendChild(bokehSrc);
	    console.log(bokehSrc)

	   	const bokehWid = document.createElement("script");
	    bokehWid.src = "http://cdn.pydata.org/bokeh/release/bokeh-widgets-0.13.0.min.js"
	    bokehWid.type = "text/javascript"
	    document.body.appendChild(bokehWid);
	    console.log(bokehWid)

    }




        fetch('/api/bokeh', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"plotKey": "Tier1", "plotGene": 'here' })
    }).then(rawResponse => (rawResponse.json())).then(jsonStr => {
      this.setState({
        bokehPlotSrc: jsonStr.plotsrc,
        bokehPlotId: jsonStr.plotid
      })
      console.log(this.state)
    })

    	componentDidUpdate () {

		const plotScript = document.createElement("script");
		// console.log(document.getElementById('bokehplot'))
		const plotDiv = document.getElementById('bokehplot')
		plotScript.src = this.props.bokehPlotSrc
	    plotScript.id = this.props.bokehPlotId
	    document.body.appendChild(plotScript);
	    //plotScript.src = "http://localhost:5006/bkapp/autoload.js?bokeh-autoload-element=053c077e-260f-431d-beda-9d6ade8c70eb&bokeh-app-path=/bkapp&bokeh-absolute-url=http://localhost:5006/bkapp"
	    //plotScript.id = "053c077e-260f-431d-beda-9d6ade8c70eb"
	    // document.body.appendChild(plotScript);
    }

    // updateDoc (){
    	//const plotScript = document.createElement("script");
		//console.log(this.props)
		//plotScript.src = this.props.bokehPlotSrc
	    //plotScript.id = this.props.bokehPlotId
	    //document.body.appendChild(plotScript);
    //}


    https://stackoverflow.com/questions/49828386/show-hide-series-in-bokeh-chart-based-on-widget-selection


      position: absolute;
  max-width: 1000px;
  max-height: 800px;
  top: 50%;
  left: 55%;
  transform: translateX(-50%) translateY(-50%);







      if (this.state.plotStatus === false){
      fetch('/api/bokeh', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"plotKey": "Tier1", "plotGene": 'Default' })
      }).then(rawResponse => (rawResponse.json())).then(jsonStr => {
        this.setState({
          bokehPlotSrc: jsonStr.plotsrc,
          bokehPlotId: jsonStr.plotid,
          plotStatus: 'pending'
        })
        console.log(this.state)
      })
    }





  async getBokeh(genesList='None') {
    const rawResponse = await fetch('/api/bokeh', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"plotKey": "Tier1", "plotGene": genesList })
    });
     await rawResponse.json().then(jsonStr => {
      this.setState({
          bokehPlotSrc: jsonStr.plotsrc,
          bokehPlotId: jsonStr.plotid
        })
      console.log(this.state)
      })
    };


	componentDidUpdate () {

		if (this.props.plotStatus === 'pending') {
			console.log("Over here")
			const plotScript = document.createElement("script");
			// console.log(document.getElementById('bokehplot'))
			const plotDiv = document.getElementById('bokehplot')

			plotScript.src = this.props.bokehPlotSrc
		    plotScript.id = this.props.bokehPlotId
		    console.log(this.props)
		    plotDiv.appendChild(plotScript)
		    this.props.setplotStatus()

		} else if (this.props.plotStatus === true) {
			console.log('Comparing Attributes...')
			console.log('Old Src:')
			console.log(this.props.curId)
			console.log('New Src:')
			console.log(this.props.bokehPlotId)
			if (this.props.curScript !== this.props.bokehPlotSrc) {

				const plotScript = document.createElement("script");
				const plotDiv = document.getElementById('bokehplot')

				plotScript.src = this.props.bokehPlotSrc
				plotScript.id = this.props.bokehPlotId
				console.log('Replacing Node....')
				plotDiv.replaceChild(plotScript, plotDiv.childNodes[1])
				console.log('Node Replaced.')
			}
		}
	    
	    //console.log(this.props.plotStatus)

    }

  Routes:
  	Simplest way is enclose app in BrowserRouter so all placed <Link>s will function across separate files. 
  	Load separate routing component as first component in App (or second if navbar)

  bootstraop Modal: 
  	To work properly, need to set up local boolean state. Switches state through onClick function or onHide functions. 
  	To force modal to return to home, must use react-router-dom Redirect to swtich path on function call.


  				gapi.signin2.render('signInGoogleButton',
            {
                'scope': 'profile email',
                'width': 240,
                'height': 40,
                'longtitle': true,
                'theme': 'dark',
                onsuccess: (googleUser) => {onSignIn(googleUser)}
            })






  componentWillMount () {
    console.log('Locating dataset...')
    console.log(this.props.location.state)
    if (this.props.location.state) {
      this.setState({
        dataset: this.props.location.state.dataset
      })
    }
  }

  	newInit() {
		gapi.load('auth2', function() { 
			console.log('gapi Loaded.')
			gapi.signin2.render('signInGoogleButton',
            {
                'scope': 'profile email',
                'width': 240,
                'height': 40,
                'longtitle': true,
                'theme': 'dark',
                onsuccess: (googleUser) => {this.onSignIn(googleUser)}

            })
		})
		
	}
    onSignIn(googleUser) {
		console.log('Over Here')
		console.log(googleUser)
		//var gInstance = gapi.auth2.getAuthInstance()
		//var curUser = gInstance.currentUser.get()
		var profile = googleUser.getBasicProfile();
		console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
		console.log('Name: ' + profile.getName());
		console.log('Image URL: ' + profile.getImageUrl());
		console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
	}

		renderSignInButton() {
		//var gInstance = gapi.auth2.getAuthInstance()
		gapi.signin2.render('signInGoogleButton',
            {
                'scope': 'profile email',
                'width': 240,
                'height': 40,
                'longtitle': true,
                'theme': 'dark',
                onsuccess: () => {this.onSignIn()}
            })
	}

		gInit() {

		console.log('Loading gapi...')
		var onSignIn = this.onSignIn
		gapi.load('auth2', function() { 
			console.log('gapi Loaded.')
			console.log(onSignIn)
			gapi.signin2.render('signInGoogleButton',
            {
                'scope': 'profile email',
                'width': 240,
                'height': 40,
                'longtitle': true,
                'theme': 'dark',
                onsuccess: (googleUser) => {onSignIn(googleUser)}
            })
			gapi.auth2.init({
				client_id: "396412765555-9h6iue2qkl0kje9fv3crgvldg2rebmru.apps.googleusercontent.com",
				//ux_mode: 'redirect',
				//redirect_uri: 'http://localhost:3000/login'
			})
		})

    }




Redux Notes                  _______________________________ 
							|								|
	Flux Design Pattern: Action -> Dispatcher -> Store -> View

	Action: action to be taken
		-Must always have a type paramenter
		-Can have additional parameters
		Ex: { type: 'INCREMENT', amount: 7}
	Dispatcher: Tell the store what action to be taken
		-Calls reducer with current state and action
		-Sets state to reducers return value
		-DOES NOT RETURN THE STATE ("Fire and Forget")
		Ex: store.dispatch(action)
	Store: Stores the state and functions necessary to change state.

	store = creatStore({
		reducers(),
		initialState
	})
	store.dispatch(action) -> reducer(state, action)

	Reducers:
		-Must be pure functions
			-Will always return same value if given same set of arguments
			-Does not alter the world around it in any way (no mutating external variables or altering database info)
		-Should treat state object as immutable
		-Will always return new array or object if state is to be modified
		Ex: 
			function reducer(state, action) {
				if (action.type === 'ADD_MESSAGE') {
					return {
						messages: state.messages.concat(action.message),
					};
				} else if (action.type === 'DELETE_MESSAGE') {
				    return {
				      messages: [
				        ...state.messages.slice(0, action.index),
				        ...state.messages.slice(
				          action.index + 1, state.messages.length
				        ),
						], };
				} else {
					return state; 
				}
			}
		-The spread operator, ... , enables us to succinctly construct new objects by copying over properties from existing ones. 
		-In arrays, the ellipsis ... operator will expand the array that follows into the parent array. The
		spread operator enables us to succinctly construct new arrays as a composite of existing arrays.

	For Views to recognize a change in state, they must "subscribe" to the store. 
		-They do this by subscribing "listeners" (functions that denote what the view wants done in response to state change)
			-The views will register a callback function that they would like to be invoked when the state changes.


    