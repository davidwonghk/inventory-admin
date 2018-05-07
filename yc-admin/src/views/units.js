// in src/unit.js
import React from 'react';
//import { List, Datagrid, TextField } from 'admin-on-rest';
import { List, Edit, Create, Datagrid, TextField, NumberField, EditButton} from 'react-admin';
import { required, SimpleForm, TextInput, NumberInput } from 'react-admin';

export const UnitList = (props) => (
    <List {...props}>
        <Datagrid>
          <TextField source="name" />
					<NumberField source="ratio" />
					<EditButton />
        </Datagrid>
    </List>
);



const UnitTitle = ({ record }) => {
	return <span>Unit {record ? `"${record.name}"` : ''}</span>;
};

export const UnitEdit = (props) => (
	<Edit title={<UnitTitle />} {...props}>
		<SimpleForm>
			<TextInput source="name" validate={required} />
			<NumberInput source="ratio" validate={required} />
		</SimpleForm>
	</Edit>
);

export const UnitCreate = (props) => (
	<Create {...props}>
		<SimpleForm>
			<TextInput source="name"  />
			<NumberInput source="ratio" />
		</SimpleForm>
	</Create>
);
