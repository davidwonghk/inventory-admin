import React from 'react';

import dataProvider from '../dataProvider';
import { GET_LIST } from 'react-admin';

import { change, Field } from 'redux-form';
import { connect, dispatch } from 'react-redux';
import {ReferenceSelectComponent} from './ReferenceSelect'


class SupplierSelectInput extends ReferenceSelectComponent {

	handleChange(event) {
		super.handleChange(event);

		dataProvider(GET_LIST, 'orders', {
	    sort: { field: 'item', order: 'ASC' },
			pagination: { page: 1, perPage: -1 },
			filter: { supplier_id: event.value }
		}).then(this.historyRecieved.bind(this));
	}

	historyRecieved(r) {
		if (!r.data || r.data.length==0) return;

		let {dispatch} = this.props.meta;
		const keys = [ 'item', 'quantity', 'size', 'netWeight', 'unit_id', 'totalCost' ];

		var data = r.data.map(old => {
			return keys.reduce((item, k) => {
				if (k in old) item[k] = old[k];
				return item;
			}, {});
		});

		dispatch(change('record-form', 'items', data));
		for(var i=0; i<data.length; ++i) {
			var d = data[i];
			keys.forEach(k=> dispatch(change('record-form', `items[${i}].${k}`, d[k])) );
		};
	}

}

const SupplierSelect = (props) => <Field name={props.source} component={SupplierSelectInput} {...props} />;

export default connect(null, { 'change': change })(SupplierSelect);
