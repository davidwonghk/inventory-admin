// in src/orders.js
import React from 'react';
import { Filter, List, Edit } from 'react-admin';
import { SimpleForm, DisabledInput, LongTextInput, ReferenceInput, SelectInput, TextInput, DateInput, NumberInput, AutocompleteInput} from 'react-admin';

import { OrderListItem } from './OrderListItem'


export const validateOrder = (item) => {
    const errors = {};
    if (item.size < 0) {
      errors.size = ['Must be over 0'];
    } else if (item.netWeight < 0) {
      errors.netWeight = ['Must be over 0'];
    } else if(typeof item.unit_id === 'undefined' || !item.unit_id) {
			errors.unit_id = ['Cannot be null'];
		}else if (item.quantity < 0) {
      errors.quantity = ['Must be over 0'];
    } else if (item.totalCost < 0) {
      errors.totalCost = ['Must be over 0'];
    } else if(typeof item.supplier_id === 'undefined' || !item.supplier_id) {
			errors.supplier_id = ['Cannot be null'];
		}
    return errors
};

const OrderFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Item Name" source="item" alwaysOn/>
        <TextInput label="Supplier Name" source="supplier" />
        <ReferenceInput label="Supplier(Select)" source="supplier_id"  reference="suppliers" >
					<SelectInput optionText="name" />
				</ReferenceInput>
        <NumberInput label="Discount" source="discount" />
				<ReferenceInput label="Item(Select)" source="id" reference="orders">
					<SelectInput optionText="item"/>
				</ReferenceInput>
        <TextInput label="Remarks" source="remarks"/>
				<DateInput label="Date" source="date"/>
    </Filter>
);


export const OrderList = (props) => (
	<List {...props} sort={{ field: 'date', order: 'DESC' }} filters={<OrderFilter />} >
		<OrderListItem/>
	</List>
);


const OrderTitle = ({ record }) => {
	return <span>Order</span>;
};



export const OrderEdit = (props) => (
	<Edit title={<OrderTitle />} {...props}>
		<SimpleForm validate={validateOrder}>
			<DisabledInput source="id" />
			<DateInput source="date"  />
			<ReferenceInput source="supplier_id" reference="suppliers" label="supplier">
				<AutocompleteInput optionText="name" />
			</ReferenceInput>
			<TextInput source="item"/>
			<NumberInput source="quantity" />
			<NumberInput source="size" />
			<NumberInput source="netWeight" />
			<ReferenceInput source="unit_id" reference="units" label="unit">
				<SelectInput optionText="name" />
			</ReferenceInput>
			<NumberInput source="totalCost" />
			<NumberInput source="discount" />
			<LongTextInput source="remarks" />
		</SimpleForm>
	</Edit>
);
