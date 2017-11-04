import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

/**
 * Navigation bar
 * @param props
 * @constructor
 */
const Navbar = props => (
  <div style={{width: '100%'}}>
    <AppBar position={'static'} style={{boxShadow: 'none', background: 'rgba(0, 0, 0, 0)'}} >
      <Toolbar style={{margin: 'auto'}}>
        <Typography type='title' style={{fontWeight: 800}} align={'center'}>
          {props.title}
        </Typography>
      </Toolbar>
    </AppBar>
  </div>
);

Navbar.propTypes = {
  title: PropTypes.string
};

export default Navbar;
