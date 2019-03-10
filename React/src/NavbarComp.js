import 'bootstrap/css/bootstrap.css'
import React from 'react';
import { Link } from "react-router-dom";
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import { connect } from 'react-redux';
import { loginCheck } from './redux/actions';

export class LoadProfile extends React.Component {
	render() {
		console.log(this.props.loginStatus)
			if (this.props.loginStatus == true) {
				this.loadbutton = () => {return( 
					<LinkContainer to="/About">
						<NavItem eventKey={5} href="#">
							Profile
						</NavItem>
					</LinkContainer>
				)}

			} else {
				this.loadbutton = () => {return( 
					<LinkContainer to="/login">
					<NavItem eventKey={5} href="#">
						Login
					</NavItem>
					</LinkContainer>
					)}
			}
			return(
				this.loadbutton()
			)
	}
}

export class CustomNav extends React.Component {

	render(){

		return (
				<Navbar inverse collapseOnSelect>
				  <Navbar.Header>
				    <Navbar.Brand>
				      <Link to="/">Single-Cell Data</Link>
				    </Navbar.Brand>
				    <Navbar.Toggle />
				  </Navbar.Header>
				  <Navbar.Collapse>
				    <Nav>
				    	<LinkContainer to="/Search"> 
				      		<NavItem eventKey={1}> Search </NavItem>
				      	</LinkContainer>
				      	<LinkContainer to="/About">
				      		<NavItem eventKey={2}> About </NavItem>
				      	</LinkContainer>
				      	<NavDropdown eventKey={3} title="Options" id="basic-nav-dropdown">
				        	<MenuItem eventKey={3.1}>Action</MenuItem>
				        	<MenuItem eventKey={3.2}>Another action</MenuItem>
				        	<MenuItem eventKey={3.3}>Test Something else here</MenuItem>
				        	<MenuItem divider />
				        	<MenuItem eventKey={3.4}>Separated link</MenuItem>
				      	</NavDropdown>
				    </Nav>
				    <Nav pullRight>
				      <NavItem eventKey={4} href="#">
				        Profile
				      </NavItem>
				      		<LoadProfile loginStatus = {this.props.loginStatus} />
				    </Nav>
				  </Navbar.Collapse>
				</Navbar>
			)
	}

}

function mapStateToProps(state) {
  return { 
  	loginStatus: state.logincheck.loginStatus,
  	loginName: state.logincheck.loginName,
  	loginPic: state.logincheck.loginPic
   }
}

export default connect(mapStateToProps)(CustomNav)