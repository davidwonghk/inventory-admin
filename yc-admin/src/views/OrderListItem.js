import React from 'react';
import {  Datagrid, DateField, ReferenceField, TextField, NumberField, EditButton } from 'react-admin';

export const OrderListItem = (props)=> (
		<Datagrid {...props}>
			<DateField source="date" locales="en-GB"/>
			<ReferenceField label="supplier" source="supplier_id" reference="suppliers" linkType="show">
				<TextField source="name"/>
			</ReferenceField>
			<TextField source="item"/>
			<NumberField source="quantity" />
			<NumberField source="size" />
			<NumberField source="netWeight" />
			<ReferenceField label="unit" source="unit_id" reference="units" >
				<TextField source="name"/>
			</ReferenceField>
			<NumberField source="unitCost" options={{ style: 'currency', currency: 'HKD' }} />
			<NumberField source="totalCost" options={{ style: 'currency', currency: 'HKD' }} />
			<NumberField source="discount" />
			<TextField source="remarks" />
			<EditButton />
		</Datagrid>
);
