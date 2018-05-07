import React from 'react';
import ReactDOM from 'react-dom';

import { Show, SimpleShowLayout } from 'react-admin';
import { List, Datagrid, TextField, NumberField } from 'react-admin';

export const SupplierShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="title" />
            <TextField source="teaser" />
            <RichTextField source="body" />
            <DateField label="Publication date" source="created_at" />
        </SimpleShowLayout>
    </Show>
);
