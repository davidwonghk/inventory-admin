import React from 'react';
import ReactDOM from 'react-dom';

import { Create, SimpleForm, LongTextInput, ReferenceInput, TextInput, DateInput, NumberInput, AutocompleteInput, SelectInput, BooleanInput} from 'react-admin';
import { ArrayInput, SimpleFormIterator, FormDataConsumer } from 'react-admin';

import { Field } from 'redux-form';
import ReferenceSelect from './ReferenceSelect'

import dataProvider from '../dataProvider';
import { GET_LIST } from 'react-admin';

class ItemsHistoryHelper extends React.Component {
	state = {history: [], value: 0};

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		console.log('componentDidMount');
		var historyCallback = (r)=> {
			this.state.history = r.data;
		}

		dataProvider(GET_LIST, 'orders', {
	    sort: { field: 'item', order: 'ASC' },
			pagination: { page: 1, perPage: -1 },
			filter: { supplier_id: this.props.supplier_id }
		}).then(historyCallback.bind(this));
	}

	render() {
		return (
			<div>
			{ this.state.history.map(h => (
				<button type="button"> {h.item} </button>
			))}
			</div>
		);
	}
}




export const OrderCreate = (props) => (
	<Create {...props}>
		<SimpleForm>
			<DateInput source="date" defaultValue={new Date()} />

			<ReferenceSelect source="supplier_id" reference="suppliers" label="Supplier" />

			<FormDataConsumer>
			{({formData, ...rest}) => (formData.supplier_id &&
				<ItemsHistoryHelper supplier_id={formData.supplier_id} {...rest}/>
			)}
			</FormDataConsumer>

	 		<ArrayInput source="items">
				<SimpleFormIterator>
					<TextInput source="item"/>
					<NumberInput source="quantity" defaultValue={1}/>
					<NumberInput source="size" />
					<NumberInput source="netWeight" />
					<ReferenceSelect source="unit_id" reference="units" label="Unit"/>
					<NumberInput source="totalCost" />
				</SimpleFormIterator>
			</ArrayInput>

			<NumberInput source="discount" defaultValue={0} />
			<LongTextInput source="remarks" />
			<BooleanInput label="Paid" source="isPaid" />
		</SimpleForm>

	</Create>
);
