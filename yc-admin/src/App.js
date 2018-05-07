import React from 'react';
import { Admin, Resource, Delete } from 'react-admin';


import { SupplierList, SupplierEdit, SupplierCreate } from './views/suppliers';
import { UnitList, UnitEdit, UnitCreate } from './views/units';
import { OrderList, OrderEdit } from './views/orders';
import { OrderCreate } from './views/OrderCreate';
import { ClearanceList, ClearanceEdit, ClearanceCreate } from './views/clearances';

import dataProvider from './dataProvider';




const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="orders" list={OrderList} create={OrderCreate} edit={OrderEdit} remove={Delete} />
        <Resource name="clearances" list={ClearanceList} create={ClearanceCreate} edit={ClearanceEdit} remove={Delete} />
        <Resource name="suppliers" list={SupplierList} create={SupplierCreate} edit={SupplierEdit} remove={Delete} />
        <Resource name="units" list={UnitList} create={UnitCreate} edit={UnitEdit} remove={Delete} />
    </Admin>
);


export default App;
