import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Grid from 'material-ui/Grid';
import Tabs, {Tab} from 'material-ui/Tabs';
import TodoContainer from '../TodoContainer';
import {CircularProgress} from 'material-ui/Progress';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import fetch from 'isomorphic-fetch';
import fetchTodos from '../../utils';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  progress: {
    margin: `0 ${theme.spacing.unit * 2}px`
  },
  tabs: {
    background: '#0F4DA8'
  }
});

/**
 * Todos Component
 */
class Todos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      items: props.items,
      load: 1,
      add: false
    };
    this.changeTab = this.changeTab.bind(this);
    this.getTodoContainer = this.getTodoContainer.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.savePosition = this.savePosition.bind(this);
    this.addTodoField = this.addTodoField.bind(this);
  }

  componentDidMount() {
    if (this.state.items === undefined) {
      fetchTodos().then(resolve => {
        this.state.items = resolve;
        this.forceUpdate();
      });
    }
  }

  async createTodo(newObj) {
    try {
      this.setState({
        load: 0
      });
      newObj.position = this.state.items.length;
      let response = await fetch('http://37.139.19.218:4000/api/todo/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newObj)
      });
      let json = await response.json();
      newObj._id = json.insertedIds[0];
      this.state.items.push(newObj);
      this.state.load = 1;
      this.forceUpdate();
    } catch (error) {
      alert("Не могу добавить");
      this.state.load = 1;
      this.forceUpdate();
    }
  }

  async updateTodo(newObj, index) {
    try {
      this.setState({
        load: 0
      });
      let response = await fetch('http://37.139.19.218:4000/api/todo/' + newObj._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newObj)
      });
      let json = await response.json();
      this.state.items[index] = newObj;

      this.state.load = 1;
      this.forceUpdate();
    } catch (error) {
      alert("Не могу обновить");
      this.state.load = 1;
      this.forceUpdate();
    }
  }

  async deleteTodo(value) {
    try {
      let indexOfStevie = this.state.items.findIndex(i => {
        return i === value;
      });
      let items = this.state.items;
      let _id = items[indexOfStevie]._id;
      items.splice(indexOfStevie, 1);
      this.setState({
        load: 0
      });
      let response = await fetch('http://37.139.19.218:4000/api/todo/' + _id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let json = await response.json();
      this.setState({
        load: 1
      });
    } catch (e) {
      alert("Не могу удалить!");
      this.setState({
        load: 1
      });
    }
  }

  async savePosition(items) {
    try {
      this.setState({
        load: 0,
        items
      });

      Promise.all(items.map(async(item, index) => {
        item.position = index;
        await fetch('http://37.139.19.218:4000/api/todo/' + item._id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(item)
        });
      }));
      this.setState({
        load: 1
      });
    } catch (e) {
      console.error(e);
    }
  }

  changeTab(event, value) {
    this.setState({value});
  };

  filterTodo(tab) {
    return value => {
      if (!tab) {
        return true;
      }
      return value.state === (tab - 1);
    };
  }

  getTodoContainer(value, filter) {
    if (this.state.items !== undefined) {
      return <TodoContainer add={this.state.add}
        deleteItem={this.deleteTodo}
        createTodo={this.createTodo}
        updateTodo={this.updateTodo}
        items={this.state.items.filter(filter)}
        title={value}
        savePosition={this.savePosition} />;
    }
  }

  addTodoField() {
    this.setState({
      add: !this.state.add
    });
  }

  render() {
    const {classes} = this.props;
    const {value} = this.state;
    const filter = this.filterTodo(value);
    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Tabs value={value} className={classes.tabs} onChange={this.changeTab}>
            <Tab label='All' />
            <Tab label='New' />
            <Tab label='Active' />
            <Tab label='Resolved' />
            <Tab label='Closed' />
          </Tabs>
        </AppBar>
        <Grid container>

          {this.state.load &&
          <Grid item xs>
            {value === 0 && this.getTodoContainer(value, filter)}
            {value === 1 && this.getTodoContainer(value, filter)}
            {value === 2 && this.getTodoContainer(value, filter)}
            {value === 3 && this.getTodoContainer(value, filter)}
            {value === 4 && this.getTodoContainer(value, filter)}
          </Grid>}
          {!this.state.load &&
          <Grid item xs>
            <CircularProgress className={classes.progress} size={50} />
          </Grid>
          }
          <Grid item>
            <Button color='primary' className={classes.tabs} onClick={this.addTodoField} fab
              style={{marginTop: '15px'}}>
              <AddIcon />
            </Button>
          </Grid>

          <Grid item xs={3}>
            <svg viewBox='0 0 334.876 334.876' width={'100%'}>
              <g>
                <path d='M35.243,94.888c12.885,19.483,24.198,42.637,25.982,46.618c0.511,1.148,1.316,3.856,2.219,7.169   c6.282-8.877,13.946-16.214,23.105-21.599c13.07-7.68,28.093-10.845,44.312-10.084c-3.916-6.217-7.479-12.619-9.192-17.601   c-4.4-12.776-20.348-65.53-29.676-88.053c-9.323-22.523-44.834-6.494-65.47,5.238S4.73,42.765,6.829,46.747   C8.923,50.728,22.358,75.405,35.243,94.888z' fill='#2b2b2b' />
                <path d='M114.37,167.478c27.446-11.313,33.314,2.41,33.314,2.41c8.697-8.066,2.622-17.601,2.622-17.601   s2.197-4.085-1.36-8.278c-2.176-2.556-9.187-11.835-15.322-21.582c-16.219-0.761-31.242,2.404-44.312,10.084   c-9.159,5.385-16.823,12.717-23.105,21.599c2.235,8.186,5.102,20.179,5.847,22.268c1.05,2.932,3.769,6.913,6.288,7.435   c2.513,0.522,3.981,2.932,3.981,2.932c3.247,6.598,13.407,7.016,13.407,7.016S86.919,178.791,114.37,167.478z' fill='#2b2b2b' />
                <path d='M319.156,225.659c-8.409-6.576-19.662-9.736-28.631-15.556   c-23.187-15.044,6.848-28.903,16.79-37.867c16.883-15.219,21.316-32.754,14.326-54.048c-2.186-6.663-6.924-13.69-4.737-7.033   c11.95,36.42-26.026,53.825-45.313,74.189c-7.103,7.5-6.124,15.632,1.256,23.116c14.278,14.479,57.23,26.7,30.606,49.207   c-18.661,15.773-47.624,17.187-68.309,30.508c-2.796,1.8-3.122,6.641-0.31,8.61c20.315,14.207,48.44,10.786,68.456,23.687   c-34.527,10.389-70.746,3.612-106.252,0.359c0.141-1.006,0.016-1.86,0.016-1.86c-4.514-27.658-4.971-33.657-2.877-47.488   c2.094-13.826,0-15.088,0-15.088c-21.37-29.333-47.331-84.73-47.331-84.73c-3.459-5.76-17.182-8.202-34.152-0.631   c-17.601,7.859-16.344,18.645-16.344,18.645l29.86,88.026c1.05,2.828,5.869,4.188,5.869,4.188   c27.973,8.066,50.774,36.333,53.814,40.733c3.04,4.4,5.238,2.725,5.238,2.725l-32.623-73.063c-2.491-0.571-5.031-2.736-6.527-5.945   c-2.165-4.65-1.305-9.633,1.92-11.134c3.225-1.501,7.593,1.05,9.758,5.7c1.632,3.503,1.539,7.19,0.022,9.442l31.101,70.273   c-0.228-0.022-0.457-0.044-0.685-0.065c-6.94-0.598,0.343,8.262,19.842,10.71c43.458,5.455,60.455,5.118,102.336-3.753   c4.297-0.908,4.373-6.396,1.55-9.274c-18.547-18.928-45.704-14.892-67.939-25.232C278.173,281.1,355.778,254.301,319.156,225.659z' fill='#2b2b2b' />
              </g>
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
            </svg>
          </Grid>

        </Grid>
      </div>
    );
  }
}
Todos.propTypes = {
  items: PropTypes.array,
  classes: PropTypes.object
};
export default withStyles(styles)(Todos);
