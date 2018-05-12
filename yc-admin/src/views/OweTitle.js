import React from 'react';

import dataProvider from '../dataProvider';
import { GET_LIST } from 'react-admin';

export class OweTitle extends React.Component{
	state = {owe:null};

	componentDidMount() {
		//dummy parameters
		var dummyParams = {
	    sort: { field: 'name', order: 'ASC' },
			pagination: { page: 1, perPage: -1 },
		};

		var updateStateOwe = (result) => {
			this.setState({'owe': result.data})
		};

		dataProvider(GET_LIST, 'owe', dummyParams)
			.then(updateStateOwe.bind(this));
	}

	render () {
		if (this.state.owe) {
			return (
				<div>
					<span> {this.props.name} </span> &nbsp;
					<span>(owe=<b>${this.state.owe}</b>)</span>
				</div>
			);
		}
		else {
			return (<span>{this.props.name} List</span>)
		}
	}
};
