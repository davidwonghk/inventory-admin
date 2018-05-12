import React from 'react';

import dataProvider from '../dataProvider';
import { GET_LIST } from 'react-admin';

import { change, Field } from 'redux-form';
import { connect } from 'react-redux';
import {ReferenceSelectComponent} from './ReferenceSelect'

const FORM_NAME = 'record-form';

class SupplierSelectInput extends ReferenceSelectComponent {
	value = null;

	componentDidMount() {
		let { dispatch, touched, error } = this.props.meta;

		if (touched && error && this.value) {
			dispatch(change(FORM_NAME, 'supplier_id', this.value));
		}
	}

	handleChange(event) {
		super.handleChange(event);

		console.log(event.value);
		this.value = event.value;

		dataProvider(GET_LIST, 'orders', {
	    sort: { field: 'item', order: 'ASC' },
			pagination: { page: 1, perPage: -1 },
			filter: { supplier_id: event.value }
		}).then(this.historyRecieved.bind(this));
	}

	historyRecieved(r) {
		if (!r.data || r.data.length===0) return;

		let {dispatch} = this.props.meta;
		const keys = [ 'item', 'quantity', 'size', 'netWeight', 'unit_id', 'totalCost' ];

		var data = r.data.map(old => {
			return keys.reduce((item, k) => {
				if (k in old) item[k] = old[k];
				return item;
			}, {});
		}).sort((a, b)=> (b.date - a.date));

		//filter out duplicate items
		var existedItems = []
		data = data.filter(i=> {
			if (existedItems.indexOf(i.item) === -1) {
				existedItems.push(i.item)
				return true;
			}
			return false;
		});

		dispatch(change(FORM_NAME, 'items', data));
		data.forEach((d, i) => {
			keys.forEach(k=> dispatch(change(FORM_NAME, `items[${i}].${k}`, d[k])) )
		});
		dispatch(change(FORM_NAME, 'discount', r.data[0].discount));
		dispatch(change(FORM_NAME, 'remarks', r.data[0].remarks));
	}

}

const SupplierSelect = (props) => <Field name={props.source} component={SupplierSelectInput} {...props} />;

export default connect(null, { 'change': change })(SupplierSelect);
