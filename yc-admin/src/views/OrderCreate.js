import React from 'react';

import { Create, SimpleForm, LongTextInput, TextInput, DateInput, NumberInput, BooleanInput} from 'react-admin';
import { ArrayInput, SimpleFormIterator } from 'react-admin';

import UnitSelect from './UnitSelect'
import SupplierSelect from './SupplierSelect'





export const OrderCreate = (props) => (
	<Create {...props}>
		<SimpleForm>
			<DateInput source="date" defaultValue={new Date()} />

			<SupplierSelect source="supplier_id" reference="suppliers" label="Supplier" />

	 		<ArrayInput source="items">
				<SimpleFormIterator>
					<TextInput source="item"/>
					<NumberInput source="quantity" defaultValue={1}/>
					<NumberInput source="size" />
					<NumberInput source="netWeight" />
					<UnitSelect reference="units" label="Unit" source="unit_id" />
					<NumberInput source="totalCost" />
				</SimpleFormIterator>
			</ArrayInput>

			<NumberInput source="discount" defaultValue={0} />
			<LongTextInput source="remarks" />
			<BooleanInput label="Paid" source="isPaid" />
		</SimpleForm>

	</Create>
);
