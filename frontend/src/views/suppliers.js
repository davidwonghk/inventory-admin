// in src/suppliers.js
import React from 'react';
//import { List, Datagrid, TextField } from 'admin-on-rest';
import { Filter, List, Edit, Create, Datagrid, TextField, NumberField, DateField,BooleanField } from 'react-admin';
import { EditButton, ShowButton, required, SimpleForm, TextInput,BooleanInput } from 'react-admin';



const SupplierFilter = (props) => (
    <Filter {...props} >
        <TextInput label="Search by Name" source="q" alwaysOn />
    </Filter>
);


export const SupplierList = (props) => (
    <List {...props} filters={<SupplierFilter />} >
        <Datagrid>
            <TextField source="name" />
						<DateField source="lastOrdered" locales="en-GB"/>
						<DateField source="lastPaid" locales="en-GB"/>
						<BooleanField source="autoPay"/>
            <NumberField source="owe" options={{ style: 'currency', currency: 'HKD' }} style={{ color: 'red' }} />
						<EditButton />
						<ShowButton />
        </Datagrid>
    </List>
);




const EditTitle = ({ record }) => {
	return <span>Supplier {record ? `"${record.name}"` : ''}</span>;
};

export const SupplierEdit = (props) => (
	<Edit title={<EditTitle />} {...props}>
		<SimpleForm>
			<TextInput source="name" validate={required} />
			<BooleanInput source="autoPay"/>
		</SimpleForm>
	</Edit>
);

export const SupplierCreate = (props) => (
	<Create {...props}>
		<SimpleForm>
			<TextInput source="name" validate={required} />
			<BooleanInput source="autoPay" defaultValue={false}/>
		</SimpleForm>
	</Create>
);
