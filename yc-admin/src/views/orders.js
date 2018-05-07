// in src/orders.js
import React from 'react';
import { List, Edit, Create, Datagrid, DateField, ReferenceField, TextField, NumberField} from 'react-admin';
import { SimpleForm, TabbedForm, EditButton, DisabledInput, LongTextInput, ReferenceInput, required, SelectInput, TextInput, DateInput, NumberInput, AutocompleteInput} from 'react-admin';
import { FormDataConsumer, ArrayInput, SimpleFormIterator } from 'react-admin';


import { Field } from 'redux-form';



export const OrderList = (props) => (
	<List {...props}>
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
	return <span>Order {record ? `"${record.date}: ${record.items}"` : ''}</span>;
};

const validateOrderItem = (values) => {
    const errors = {};
    if (values.size < 0) {
        errors.size = ['Must be over 0'];
    } else if (values.netWeight < 0) {
        errors.netWeight = ['Must be over 0'];
    } else if (values.quantity < 0) {
        errors.quantity = ['Must be over 0'];
    } else if (values.totalCost < 0) {
        errors.totalCost = ['Must be over 0'];
    }
    return errors
};


export const OrderEdit = (props) => (
	<Edit title={<OrderTitle />} {...props}>
		<SimpleForm validate={validateOrderItem}>
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



export const OrderCreate = (props) => (
	<Create {...props}>
		<SimpleForm>
			<DateInput source="date" defaultValue={new Date()} />
			<ReferenceInput source="supplier_id" reference="suppliers" label="supplier" allowEmpty>
				<AutocompleteInput optionText="name" />
			</ReferenceInput>

			<FormDataConsumer>
			 {({formData, ...rest}) => formData.supplier_id && (
			 	<ArrayInput source="items">
					<SimpleFormIterator validate={validateOrderItem}>
						<TextInput source="item"/>
						<NumberInput source="quantity" defaultValue={1}/>
						<NumberInput source="size" />
						<NumberInput source="netWeight" />
						<NumberInput source="totalCost" />
					</SimpleFormIterator>
				</ArrayInput>
			)}
			</FormDataConsumer>

			<NumberInput source="discount" defaultValue={0} />
			<LongTextInput source="remarks" />
		</SimpleForm>

	</Create>
);
