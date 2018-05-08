import React from 'react';
import ReactDOM from 'react-dom';

import { Create, SimpleForm, LongTextInput, ReferenceInput, TextInput, DateInput, NumberInput, AutocompleteInput, SelectInput} from 'react-admin';
import { ArrayInput, SimpleFormIterator, FormDataConsumer } from 'react-admin';

import { Field } from 'redux-form';
import { SelectField, MenuItem, MuiThemeProvider } from 'material-ui'

import { GET_LIST } from 'react-admin';
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



class ItemsHistoryHelper extends React.Component {
	state = {history: []};

	constructor(props) {
		super(props);
	}

	change(event){
		this.setState({value: event.target.value});
	}

	componentDidMount() {
			var cb = (r)=> {
				this.state.history = r
			}

			dataProvider(GET_LIST, 'orders', {
		    sort: { field: 'item', order: 'ASC' },
				pagination: { page: 1, perPage: -1 },
				filter: { supplier_id: this.props.supplier_id }
			}).then(cb.bind(this));
	}

	render() {
		return (<div/>);
	}
}



export const validateOrderItem = (item) => {
    const errors = {};
    if (item.size < 0) {
      errors.size = ['Must be over 0'];
    } else if (item.netWeight < 0) {
      errors.netWeight = ['Must be over 0'];
    } else if(typeof item.unit_id === 'undefined' || !item.unit_id) {
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
		<SimpleForm>
			<DateInput source="date" defaultValue={new Date()} />
			<ReferenceInput source="supplier_id" reference="suppliers" label="supplier" allowEmpty>
				<SelectInput optionText="name" />
			</ReferenceInput>

			<FormDataConsumer>
			{({formData, ...rest}) => (formData.supplier_id &&
				<ItemsHistoryHelper supplier_id={formData.supplier_id} callback={ (output)=>{Object.assign(formData, output)} } {...rest}/>
			)}
			</FormDataConsumer>

	 		<ArrayInput source="items">
				<SimpleFormIterator validate='validateOrderItem'>
					<TextInput source="item"/>
					<NumberInput source="quantity" defaultValue={1}/>
					<NumberInput source="size" />
					<NumberInput source="netWeight" />
					<UnitInput source="unit_id"/>
					<NumberInput source="totalCost" />
				</SimpleFormIterator>
			</ArrayInput>

			<NumberInput source="discount" defaultValue={0} />
			<LongTextInput source="remarks" />
		</SimpleForm>

	</Create>
);
