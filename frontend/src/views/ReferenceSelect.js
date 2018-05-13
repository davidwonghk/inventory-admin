import React from 'react';

import { Field } from 'redux-form';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AsyncSelect from 'react-select/lib/Async';

import dataProvider from '../dataProvider';
import { GET_LIST, Labeled } from 'react-admin';


class ReferenceSelectInput extends React.Component {
	data = [];

	loadOptions(input, callback) {
		dataProvider(GET_LIST, this.props.reference, {
	    sort: { field: 'name', order: 'ASC' },
			pagination: { page: 1, perPage: -1 },
		}).then( (r)=> {
			this.data = r.data;

			var options = r.data.map(d=>({'value':d.id, 'label':d.name}))
			options = options.sort((a,b)=>(a.value-b.value));
			if (input !== "") {
				options = options.filter((i)=>(i.name.includes(input)));
			}

			this.postLoadOptions();
			callback(options);
		});
	}

	handleChange(event) {
    this.props.input.onChange(event.value);
	}

	render() {
		var color = (this.props.input.value==="") ? 'red' : '';

		return (
			<MuiThemeProvider class="ra-input ra-input-items">
				<Labeled label={<font color={color}>{this.props.label}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</font>}>
				<AsyncSelect
					cacheOptions
					defaultOptions
					autosize
	        loadOptions={this.loadOptions.bind(this)}
					onChange={this.handleChange.bind(this)}
					source={this.props.source}
				/>
				</Labeled>
			</MuiThemeProvider>
		);
	}

}		//class ReferenceSelect


const ReferenceSelect = (props) => <Field name={props.source} component={ReferenceSelectInput} {...props} />;
export const ReferenceSelectComponent = ReferenceSelectInput;
export default ReferenceSelect;
