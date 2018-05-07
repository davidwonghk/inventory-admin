import React from 'react';
import ReactDOM from 'react-dom';

import { Create, SimpleForm, TabbedShowLayout, LongTextInput, ReferenceInput, required, TextInput, DateInput, NumberInput, AutocompleteInput} from 'react-admin';
import { ArrayInput, SimpleFormIterator, FormDataConsumer } from 'react-admin';

import { Field } from 'redux-form';

import { GET_LIST, GET_MANY, } from 'react-admin';
import dataProvider from '../dataProvider';

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


export const validateOrderItem = (item) => {
    const errors = {};
    if (item.size < 0) {
      errors.size = ['Must be over 0'];
    } else if (item.netWeight < 0) {
      errors.netWeight = ['Must be over 0'];
    } else if(typeof item.unit_id !== 'undefined' && item.unit_id) {
			errors.unit_id = ['Must select'];
		}else if (item.quantity < 0) {
      errors.quantity = ['Must be over 0'];
    } else if (item.totalCost < 0) {
      errors.totalCost = ['Must be over 0'];
    }
    return errors
};



export const OrderCreate = (props) => (
	<Create {...props}>
		<TabbedShowLayout>
		<SimpleForm>
			<DateInput source="date" defaultValue={new Date()} />
			<ReferenceInput source="supplier_id" reference="suppliers" label="supplier" allowEmpty>
				<AutocompleteInput optionText="name" />
			</ReferenceInput>

		 	<ArrayInput source="items">
				<SimpleFormIterator validate={validateOrderItem}>
					<TextInput source="item"/>
					<NumberInput source="quantity" defaultValue={1}/>
					<NumberInput source="size" />
					<NumberInput source="netWeight" />
					<UnitInput source="unit_id"/>
					<NumberInput source="totalCost" />
				</SimpleFormIterator>
			</ArrayInput>

			<FormDataConsumer>
			 {({formData, ...rest}) => {
					if (formData.supplier_id) {
					 	//formData.items[0].item = 'hello world'
					}
				}
			}
			</FormDataConsumer>

			<NumberInput source="discount" defaultValue={0} />
			<LongTextInput source="remarks" />
		</SimpleForm>
		</TabbedShowLayout>

	</Create>
);
