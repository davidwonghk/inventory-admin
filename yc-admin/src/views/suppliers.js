// in src/suppliers.js
import React from 'react';
//import { List, Datagrid, TextField } from 'admin-on-rest';
import { List, Edit, Create, Datagrid, TextField, NumberField } from 'react-admin';
import{ EditButton, required, SimpleForm, TextInput } from 'react-admin';

export const SupplierList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="name" />
            <NumberField source="owe" />
			<EditButton />
        </Datagrid>
    </List>
);




const SupplierTitle = ({ record }) => {
	return <span>Supplier {record ? `"${record.name}"` : ''}</span>;
};

export const SupplierEdit = (props) => (
	<Edit title={<SupplierTitle />} {...props}>
		<SimpleForm>
			<TextInput source="name" validate={required} />
		</SimpleForm>
	</Edit>
);

export const SupplierCreate = (props) => (
	<Create {...props}>
		<SimpleForm>
			<TextInput source="name" validate={required} />
		</SimpleForm>
	</Create>
);
