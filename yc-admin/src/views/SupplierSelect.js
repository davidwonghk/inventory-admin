import React from 'react';

import dataProvider from '../dataProvider';
import { GET_LIST, showNotification as showNotificationAction } from 'react-admin';

import { Field, change as changeAction } from 'redux-form';
import { connect } from 'react-redux';
import {ReferenceSelectComponent} from './ReferenceSelect'

const DEFAULT_ITEM = Object({ 'item':'', 'quantity':1, 'size':0, 'netWeight':0, 'unit_id':1, 'totalCost':0 });

class SupplierSelectInput extends ReferenceSelectComponent {
	postLoadOptions() {
		let {change} = this.props;
		let {dispatch, form} = this.props.meta;

		var data = Array();
		data.push(DEFAULT_ITEM);
		dispatch(change(form, 'items', data));
	}

	render() {
		let {showNotification} = this.props;
		let {touched, error} = this.props.meta;
		if (touched && error) {
			showNotification("Supplier cannot be empty", 'warning');
		}

		return super.render();
	}

	handleChange(event) {
		super.handleChange(event);

		dataProvider(GET_LIST, 'orders', {
	    sort: { field: 'item', order: 'ASC' },
			pagination: { page: 1, perPage: -1 },
			filter: { supplier_id: event.value }
		}).then(this.historyRecieved.bind(this));
	}

	historyRecieved(r) {
		if (!r.data || r.data.length===0) return;

		let {change} = this.props;
		let {dispatch, form} = this.props.meta;

		const keys = Object.keys(DEFAULT_ITEM);

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

		dispatch(change(form, 'items', data));
		data.forEach((d, i) => {
			keys.forEach(k=> dispatch(change(form, `items[${i}].${k}`, d[k])) )
		});
		dispatch(change(form, 'discount', r.data[0].discount));
		dispatch(change(form, 'remarks', r.data[0].remarks));
	}

}

const SupplierSelect = (props) => <Field name={props.source} component={SupplierSelectInput} {...props} />;

export default connect(null, {
	 'change': changeAction,
	 'showNotification': showNotificationAction,
 })(SupplierSelect);
