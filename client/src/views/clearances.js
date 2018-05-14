// in src/clerances.js
import React from 'react';
import { Filter, List, Edit, Create, Datagrid, DateField, ReferenceField, TextField, NumberField} from 'react-admin';
import { EditButton, DisabledInput, LongTextInput, ReferenceInput, SelectInput, SimpleForm, TextInput, DateInput, NumberInput } from 'react-admin';
import { AutocompleteInput } from 'react-admin';



const ClearanceFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Supplier Name" source="supplier" alwaysOn/>
        <ReferenceInput label="Supplier Id" source="supplier_id"  reference="suppliers" >
					<SelectInput optionText="name" />
				</ReferenceInput>
        <TextInput label="Remarks" source="remarks"/>
				<DateInput label="Date" source="date"/>
    </Filter>
);

export const ClearanceList = (props) => (
	<List filters={<ClearanceFilter />} sort={{ field: 'date', order: 'DESC' }}  {...props}>
		<Datagrid>
			<DateField source="date" locales="en-GB"/>
			<ReferenceField label="supplier" source="supplier_id" reference="suppliers" linkType="show">
				<TextField source="name"/>
			</ReferenceField>
			<NumberField source="paid" options={{ style: 'currency', currency: 'HKD' }} />
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
			<DateInput source="date" locales="en-GB"/>
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
			<DateInput source="date" locales="en-GB" defaultValue={new Date()} />
			<ReferenceInput source="supplier_id" reference="suppliers" label="supplier" allowEmpty>
				<AutocompleteInput optionText="name" />
			</ReferenceInput>
			<NumberInput source="paid" />
			<LongTextInput source="remarks" />
		</SimpleForm>
	</Create>
);
