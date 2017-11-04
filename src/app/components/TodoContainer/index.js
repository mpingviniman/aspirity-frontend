import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import SortableListTodo from './SortableListTodo';

/**
 * Function moveElement from oldIndex to positionChange
 * @param array
 * @param oldIndex
 * @param positionChange
 * @param value
 * @returns {*}
 */
const moveElementInArray = (array, oldIndex, positionChange, value) => {
  if (oldIndex > -1) {
    let newIndex = positionChange;
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= array.length) {
      newIndex = array.length;
    }
    let arrayClone = array.slice();
    arrayClone.splice(oldIndex, 1);
    arrayClone.splice(newIndex, 0, value);
    return arrayClone;
  }
  return array;
};
const styles = theme => ({
  root: {
    maxWidth: '800px',
    background: theme.palette.background.paper
  }
});

/**
 * Class for TodoList
 */
class TodoContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      default: {'title': '', 'priority': 0, 'state': 0, 'term': new Date().toLocaleString()}
    };
    this.onSortEnd = this.onSortEnd.bind(this);
  }

  onSortEnd({oldIndex, newIndex}) {
    let items = this.state.items;
    items = moveElementInArray(items, oldIndex, newIndex, items[oldIndex]);
    if (!this.props.title) {
      this.props.savePosition(items);
    }
  };

  render() {
    return (
      <div>
        <SortableListTodo items={this.state.items}
          add={this.props.add}
          handleCreate={this.props.createTodo}
          handleUpdate={this.props.updateTodo}
          onSortEnd={this.onSortEnd}
          pressDelay={200}
          handleDelete={this.props.deleteItem}
          addvalue={this.state.default} />
      </div>
    );
  }
}
TodoContainer.PropTypes = {
  add: PropTypes.bool,
  deleteItem: PropTypes.func,
  items: PropTypes.array,
  title: PropTypes.number,
  updateTodo: PropTypes.func,
  createTodo: PropTypes.func,
  savePosition: PropTypes.func

};
export default withStyles(styles)(TodoContainer);
