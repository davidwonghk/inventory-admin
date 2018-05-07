// in src/clerances.js
import React from 'react';
import { List, Edit, Create, Datagrid, DateField, ReferenceField, TextField, NumberField} from 'react-admin';
import { EditButton, DisabledInput, LongTextInput, ReferenceInput, required, SelectInput, SimpleForm, TextInput, DateInput, NumberInput } from 'react-admin';
import { AutocompleteInput } from 'react-admin';


export const ClearanceList = (props) => (
	<List {...props}>
		<Datagrid>
			<DateField source="date"/>
			<ReferenceField label="supplier" source="supplier_id" reference="suppliers" validate={required}>
				<TextField source="name"/>
			</ReferenceField>
			<NumberField source="paid" />
			<TextField source="remarks" />
			<EditButton />
		</Datagrid>
	</List>
);


const ClearanceTitle = ({ record }) => {
	return <span>Clearance {record ? `"${record.date} "` : ''}</span>;
};

export const ClearanceEdit = (props) => (
	<Edit title={<ClearanceTitle />} {...props}>
		<SimpleForm>
			<DisabledInput source="id" />
			<DateInput source="date" />
			<ReferenceInput source="supplier_id" reference="suppliers" label="supplier">
				<AutocompleteInput optionText="name" />
			</ReferenceInput>
			<NumberInput source="paid" />
			<LongTextInput source="remarks" />
		</SimpleForm>
	</Edit>
);

export const ClearanceCreate = (props) => (
	<Create {...props}>
		<SimpleForm>
			<DateInput source="date" defaultValue={new Date()} />
			<ReferenceInput source="supplier_id" reference="suppliers" label="supplier" allowEmpty>
				<AutocompleteInput optionText="name" />
			</ReferenceInput>
			<NumberInput source="paid" />
			<LongTextInput source="remarks" />
		</SimpleForm>
	</Create>
);
