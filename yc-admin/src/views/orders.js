// in src/orders.js
import React from 'react';
import { Filter, List, Edit, Datagrid, DateField, ReferenceField, TextField, NumberField} from 'react-admin';
import { SimpleForm, EditButton, DisabledInput, LongTextInput, ReferenceInput, required, SelectInput, TextInput, DateInput, NumberInput, AutocompleteInput} from 'react-admin';

import { validateOrderItem } from './OrderCreate'


const OrderFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search Supplier" source="supplier" alwaysOn />
    </Filter>
);


export const OrderList = (props) => (
	<List {...props} filters={<OrderFilter />} >
		<Datagrid>
			<DateField source="date"/>
			<ReferenceField label="supplier" source="supplier_id" reference="suppliers" validate={required}>
				<TextField source="name"/>
			</ReferenceField>
			<TextField source="items"/>
			<NumberField source="quantity" />
			<NumberField source="size" />
			<NumberField source="netWeight" />
			<ReferenceField label="unit" source="unit_id" reference="units" validate={required} >
				<TextField source="name"/>
			</ReferenceField>
			<NumberField source="unitCost" />
			<NumberField source="totalCost" />
			<NumberField source="discount" />
			<TextField source="remarks" />
			<EditButton />
		</Datagrid>
	</List>
);


const OrderTitle = ({ record }) => {
	return <span>Order</span>;
};



export const OrderEdit = (props) => (
	<Edit title={<OrderTitle />} {...props}>
		<SimpleForm validate='validateOrderItem'>
			<DisabledInput source="id" />
			<DateInput source="date"  />
			<ReferenceInput source="supplier_id" reference="suppliers" label="supplier">
				<AutocompleteInput optionText="name" />
			</ReferenceInput>
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
