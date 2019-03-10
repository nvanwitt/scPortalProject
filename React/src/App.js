import React from 'react'
import CustomNav from './NavbarComp'
import Routes from './Routes'

export default class App extends React.Component {
	render() {
		return (
			  <div>
			    <CustomNav />
			    <Routes />
			  </div>
			)
	}
}
