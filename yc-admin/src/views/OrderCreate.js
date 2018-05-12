import React from 'react';

import { Create, SimpleForm, LongTextInput, TextInput, DateInput, NumberInput, BooleanInput} from 'react-admin';
import { ArrayInput, SimpleFormIterator } from 'react-admin';

import UnitSelect from './UnitSelect'
import SupplierSelect from './SupplierSelect'


const validateOrder = (order) => {
    const errors = {};
    if (!order.items || order.items.size <= 0) {
      errors.items = ['at least one item'];
    } else if(typeof order.supplier_id === 'undefined' || !order.supplier_id) {
			errors.supplier_id = ['Cannot be null'];
    }
    return errors
};

const validateOrderItem = (item) => {
    const errors = {};
    if (item.netWeight < 0) {
      errors.netWeight = ['Must be over 0'];
    } else if(typeof item.unit_id === 'undefined' || !item.unit_id) {
			errors.unit_id = ['Cannot be null'];
		}else if (item.quantity < 0) {
      errors.quantity = ['Must be over 0'];
    } else if (item.totalCost < 0) {
      errors.totalCost = ['Must be over 0'];
    }
    return errors
};


export const OrderCreate = (props) => (
	<Create {...props}>
		<SimpleForm validate={validateOrder}>
			<DateInput source="date" defaultValue={new Date()} />

			<SupplierSelect source="supplier_id" reference="suppliers" label="Supplier" />

	 		<ArrayInput source="items">
				<SimpleFormIterator validate={validateOrderItem}>
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
