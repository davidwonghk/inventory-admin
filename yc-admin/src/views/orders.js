// in src/orders.js
import React from 'react';
import { Filter, List, Edit } from 'react-admin';
import { SimpleForm, EditButton, DisabledInput, LongTextInput, ReferenceInput, required, SelectInput, TextInput, DateInput, NumberInput, AutocompleteInput} from 'react-admin';

import { validateOrderItem } from './OrderCreate'
import { OrderListItem } from './OrderListItem'

import { OweTitle } from './OweTitle'

const OrderFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Item Name" source="item" alwaysOn/>
        <TextInput label="Supplier Name" source="supplier" />
        <ReferenceInput label="Supplier Id" source="supplier_id"  reference="suppliers" >
					<SelectInput optionText="name" />
				</ReferenceInput>
        <NumberInput label="Discount" source="discount" />
				<ReferenceInput label="Item Id" source="id" reference="orders">
					<SelectInput optionText="item"/>
				</ReferenceInput>
        <TextInput label="Remarks" source="remarks"/>
				<DateInput label="Date" source="date"/>
    </Filter>
);


export const OrderList = (props) => (
	<List {...props} title={<OweTitle name="Orders"/>} filters={<OrderFilter />} >
		<OrderListItem/>
	</List>
);


const OrderTitle = ({ record }) => {
	return <span>Order</span>;
};



export const OrderEdit = (props) => (
	<Edit title={<OrderTitle />} {...props}>
		<SimpleForm validate={validateOrderItem}>
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
