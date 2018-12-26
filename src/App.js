import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Aurora, Pipeline, Swirl, Shift, Coalesce} from 'ambient-cbg'

const styles = {
	root: {
		flexGrow: 1,
	},
};

class App extends Component {
	state = {
		value: 0,
	};

	handleChange = (event, value) => {
		this.setState({ value: value });
		console.log(this.state);
	};

	render() {
		const { classes } = this.props;
		const bgNames = ['Shift', 'Aurora', 'Pipeline', 'Coalesce'];
		return (
			<div className="App">
				{
					this.state.value === 0 && <Swirl/>
				}
				{
					this.state.value === 1 && <Shift/>
				}
				{
					this.state.value === 2 && <Aurora/>
				}
				{
					this.state.value === 3 && <Pipeline/>
				}
				{
					this.state.value === 4 && <Coalesce/>
				}
				<Paper className={classes.root} style={{backgroundColor: 'rgba(0,0,0,0)'}}>
					<Tabs
						TabIndicatorProps={{
							style: {
								backgroundColor: 'white',
							}
						}}
						value={this.state.value}
						onChange={this.handleChange}
						indicatorColor="primary"
						textColor="primary"
						centered>
						<Tab label="Swirl" value={0} style={{ color: 'white', fontWeight: 'bold' }} selected/>
						{bgNames.map(function(name, index){
							return <Tab key={index} label={name} value={index + 1} style={{ color: 'white', fontWeight: 'bold' }}/>;
						})}
					</Tabs>
				</Paper>
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo"/>
					<a
						className="App-link"
						href="https://reactjs.org"
						target="_blank"
						rel="noopener noreferrer"
					>
						React
					</a>
					<p>
						Ambient Canvas Backgrounds</p>
					<a
						className="App-link"
						href="https://github.com/YuriyLisovskiy/ambient-cbg"
						target="_blank"
						rel="noopener noreferrer"
					>
						Source | GitHub
					</a>
				</header>
				<footer>
					<a
						className="App-link"
						href="https://github.com/YuriyLisovskiy"
						target="_blank"
						rel="noopener noreferrer"
					>
						Author | GitHub
					</a>
				</footer>
			</div>
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
