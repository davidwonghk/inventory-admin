// in src/suppliers.js
import React from 'react';
//import { List, Datagrid, TextField } from 'admin-on-rest';
import { Filter, List, Edit, Create, Datagrid, TextField, NumberField, DateField } from 'react-admin';
import { EditButton, ShowButton, required, SimpleForm, TextInput, BooleanInput } from 'react-admin';

import { OweTitle } from './OweTitle'

class MyShowButton extends React.Component {
	render() {
		const { push, record, showNotification } = this.props;
		var target = this.props.target;
		return (
			<a href={`/${target}/#${target}?filter=%7B"supplier_id"%3A${record.id}%7D`}>{target}</a>
		);
	}
};


const SupplierFilter = (props) => (
    <Filter {...props} >
        <TextInput label="Search" source="q" alwaysOn />
    </Filter>
);


export const SupplierList = (props) => (
    <List title={<OweTitle name="Suppliers"/>} {...props} filters={<SupplierFilter />} >
        <Datagrid>
            <TextField source="name" />
						<DateField source="lastOrdered"/>
						<DateField source="lastCleared"/>
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
