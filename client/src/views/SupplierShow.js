import React from 'react';

import { Show, TabbedShowLayout, Tab } from 'react-admin';
import { Datagrid, ReferenceManyField } from 'react-admin';
import { TextField, NumberField, DateField, EditButton } from 'react-admin';
import { OrderListItem } from './OrderListItem'

export const SupplierShow = (props) => (
    <Show {...props}>
			<TabbedShowLayout>
				<Tab label="summary">
	        <TextField source="name" />
	        <NumberField source="owe" options={{ style: 'currency', currency: 'HKD' }} style={{ color: 'red' }} />
					<DateField source="lastOrdered" locales="en-GB"/>
					<DateField source="lastPaid" locales="en-GB"/>
				</Tab>

				<Tab label="Orders">
          <ReferenceManyField reference="orders" target="supplier_id" addLabel={false}>
						<OrderListItem/>
          </ReferenceManyField>
				</Tab>

				<Tab label="Clearances">
          <ReferenceManyField reference="clearances" target="supplier_id" addLabel={false}>
					<Datagrid>
						<DateField source="date" locales="en-GB"/>
						<NumberField source="paid" options={{ style: 'currency', currency: 'HKD' }} />
						<TextField source="remarks" />
						<EditButton />
					</Datagrid>
          </ReferenceManyField>
				</Tab>
			</TabbedShowLayout>
    </Show>
);
