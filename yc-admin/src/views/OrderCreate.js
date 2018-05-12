import React from 'react';
import ReactDOM from 'react-dom';

import { Create, SimpleForm, LongTextInput, ReferenceInput, TextInput, DateInput, NumberInput, AutocompleteInput, SelectInput, BooleanInput} from 'react-admin';
import { ArrayInput, SimpleFormIterator, FormDataConsumer, } from 'react-admin';

import { Field } from 'redux-form';
import ReferenceSelect from './ReferenceSelect'
import SupplierSelect from './SupplierSelect'

import dataProvider from '../dataProvider';
import { GET_LIST } from 'react-admin';


class UnitInput extends React.Component {

  constructor(props) {
    super(props);
		if (props.source) {
			this.name = props.source.replace('.undefined', '.	unit_id');
		}
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
			<Field name={this.name} component="select">
				  <option />
					{this.unitData.map(u => (
						<option key={parseInt(u.id)} value={parseInt(u.id)}>{u.name}</option>
					))}
			</Field>
		)
	}
}


export const OrderCreate = (props) => (
	<Create {...props}>
		<SimpleForm>
			<DateInput source="date" defaultValue={new Date()} />

			<SupplierSelect source="supplier_id" reference="suppliers" label="Supplier" />

	 		<ArrayInput source="items">
				<SimpleFormIterator>
					<TextInput source="item"/>
					<NumberInput source="quantity" defaultValue={1}/>
					<NumberInput source="size" />
					<NumberInput source="netWeight" />
					<UnitInput reference="units" label="Unit" source="unit_id" />
					<NumberInput source="totalCost" />
				</SimpleFormIterator>
			</ArrayInput>

			<NumberInput source="discount" defaultValue={0} />
			<LongTextInput source="remarks" />
			<BooleanInput label="Paid" source="isPaid" />
		</SimpleForm>

	</Create>
);
