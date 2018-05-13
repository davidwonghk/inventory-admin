import React from 'react';
import ReactDOM from 'react-dom';

import { reduxForm, reducer as formReducer } from 'redux-form';
import { createStore, combineReducers, bindActionCreators } from 'redux';
import { Provider } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AsyncSelect from 'react-select/lib/Async';
import { DatePicker, TextField, MenuItem } from 'material-ui';



const orderReducer = (state = this.initialState, action) => {

  switch (action.type) {
    case 'LIST_REFERENCES':
      return { ...state, options: action.values};
    default:
      return state;
  }
};

//--------------------------------------------------


const mapDispatchToProps = (dispatch) =>{
  return bindActionCreators({
		//actions
		listReferences: resource => ({ type: "LIST_REFERENCES", payload: resource }),
	}, dispatch);
}



export class OrderCreate extends React.Component {

	constructor(props) {
		super(props);
		this.handleSupplierSelectChange = this.handleSupplierSelectChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSupplierSelectChange(event) {
	}

	handleSubmit(event) {
		event.preventDefault();
	}

	render() {
		return (
			<MuiThemeProvider>
			<form onSubmit={this.handleSubmit} height="100%">
				<DatePicker label="Date" source="date" defaultValue={new Date()} />
				<ReferenceSelect label="Supplier" source="supplier_id" reference="suppliers" />
			</form>
			</MuiThemeProvider>
		);
	}
}

//export default connect(null, mapDispatchToProps)(MyOrderCreate);

/*
				<ReferenceInput source="supplier_id" reference="suppliers" label="supplier" >
					<SelectInput optionText="name" />
				</ReferenceInput>

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
						<UnitInput source="unit_id"/>
						<NumberInput source="totalCost" />
					</SimpleFormIterator>
				</ArrayInput>

				<NumberInput source="discount" defaultValue={0} />
				<LongTextInput source="remarks" />
				*/
