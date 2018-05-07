import React from 'react';
import { Admin, Resource, Delete } from 'react-admin';


import { SupplierList, SupplierEdit, SupplierCreate } from './views/suppliers';
import { UnitList, UnitEdit, UnitCreate } from './views/units';
import { OrderList, OrderEdit, OrderCreate } from './views/orders';
import { ClearanceList, ClearanceEdit, ClearanceCreate } from './views/clearances';
import jsonServerProvider from 'ra-data-json-server';




const App = () => (
    <Admin dataProvider={jsonServerProvider('http://127.0.0.1:3001/api/v1')}>
        <Resource name="orders" list={OrderList} create={OrderCreate} edit={OrderEdit} remove={Delete} />
        <Resource name="clearances" list={ClearanceList} create={ClearanceCreate} edit={ClearanceEdit} remove={Delete} />
        <Resource name="suppliers" list={SupplierList} create={SupplierCreate} edit={SupplierEdit} remove={Delete} />
        <Resource name="units" list={UnitList} create={UnitCreate} edit={UnitEdit} remove={Delete} />
    </Admin>
);


export default App;
