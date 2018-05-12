import React from 'react';
import ReactDOM from 'react-dom';

import { reduxForm, reducer as formReducer } from 'redux-form';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AsyncSelect from 'react-select/lib/Async';

import dataProvider from '../dataProvider';
import { GET_LIST } from 'react-admin';

export default class ReferenceSelect extends React.Component {
	state = {options:[]}

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		console.log(props.source);
	}

	loadOptions(input, callback) {
		dataProvider(GET_LIST, this.props.reference, {
	    sort: { field: 'name', order: 'ASC' },
			pagination: { page: 1, perPage: -1 },
		}).then( (r)=> {
			var options = r.data.map(d=>({'value':d.id, 'label':d.name}))
			options = options.sort((a,b)=>(a.value-b.value));
			if (input != "") {
				options = options.filter((i)=>(i.name.includes(input)));
			}
			callback(options);
		});
	}

	handleChange() {
	}

	render() {
		return (
			<MuiThemeProvider>
				<AsyncSelect
					cacheOptions
					defaultOptions
					autosize
	        loadOptions={this.loadOptions.bind(this)}
					floatingLabelText={this.props.label}
					onChange={this.handleChange}
				/>
			</MuiThemeProvider>
		);
	}

}
