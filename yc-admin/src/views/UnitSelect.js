import React from 'react';

import { Field } from 'redux-form';
import dataProvider from '../dataProvider';
import { GET_LIST } from 'react-admin';

class UnitSelect extends React.Component {

  constructor(props) {
    super(props);
		if (props.source) {
			this.name = props.source.replace('.undefined', '.	unit_id');
		}
    this.unitData = [];
  }

	componentDidMount() {
			var cb = (r)=> {
				this.unitData = r.data;
			}

			dataProvider(GET_LIST, 'units', {
		    sort: { field: 'name', order: 'ASC' },
				pagination: { page: 1, perPage: -1 },
			}).then(cb.bind(this));
	}

	render() {
		return (
			<Field name={this.name} component="select">
				  <option />
					{this.unitData.map(u => {
						const id = parseInt(u.id, 10);
						return <option key={id} value={id}>{u.name}</option>
					})}
			</Field>
		)
	}
}


export default UnitSelect;
