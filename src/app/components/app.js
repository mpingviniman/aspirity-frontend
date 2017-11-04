import React from 'react';
import Navbar from './Navbar';
import Todos from './Todos';
import PropTypes from 'prop-types';
import './app.less';
const AppA = props => (
  <div className='container'>
    <Navbar title='TodoApp' />
    <Todos items={props.items} />
  </div>
);
AppA.PropTypes = {
  items: PropTypes.array
};

export default AppA;
