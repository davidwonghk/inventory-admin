import React from 'react';
import ReactDOM from 'react-dom';

import { Create, SimpleForm, TabbedForm, LongTextInput, ReferenceInput, required, TextInput, DateInput, NumberInput, AutocompleteInput} from 'react-admin';
import { ArrayInput, SimpleFormIterator, FormDataConsumer } from 'react-admin';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {SelectField, MenuItem } from 'material-ui';

import { GET_LIST, GET_MANY, } from 'react-admin';
import dataProvider from '../dataProvider';

class UnitInput extends React.Component {

  constructor(props) {
    super(props);
    this.unitData = [];
  }

	componentDidMount() {
			var cb = (r)=> {
				this.unitData = r.data;
			}

			dataProvider(GET_LIST, 'units', {
		    sort: { field: 'name', order: 'ASC' },
				pagination: { page: 1, perPage: -1 },
			}).then(cb.bind(this));
	}

	render() {
		return (
			<MuiThemeProvider>
			<SelectField value={1}>
					{this.unitData.map(u => (
						<MenuItem value={u.id} key={u.id} primaryText={u.name} />
					))}
			</SelectField>
			</MuiThemeProvider>
		)
	}
}


export const OrderCreate = (props) => (
	<Create {...props}>
		<SimpleForm>
			<DateInput source="date" defaultValue={new Date()} />
			<ReferenceInput source="supplier_id" reference="suppliers" label="supplier" allowEmpty>
				<AutocompleteInput optionText="name" />
			</ReferenceInput>

		 	<ArrayInput source="items">
				<SimpleFormIterator>
					<TextInput source="item"/>
					<NumberInput source="quantity" defaultValue={1}/>
					<NumberInput source="size" />
					<NumberInput source="netWeight" />
					<UnitInput name="unit"/>
					<NumberInput source="totalCost" />
				</SimpleFormIterator>
			</ArrayInput>

			<FormDataConsumer>
			 {({formData, ...rest}) => {
				 if (formData.supplier_id)
				 	formData.items[0].item = 'hello world'
				}
			}
			</FormDataConsumer>

			<NumberInput source="discount" defaultValue={0} />
			<LongTextInput source="remarks" />
		</SimpleForm>

	</Create>
);
