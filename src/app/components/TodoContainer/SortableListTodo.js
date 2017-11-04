import React from 'react';
import SortableTodo from './SortableTodo';
import {SortableContainer} from 'react-sortable-hoc';
import List from 'material-ui/List';

/**
 * SortableList
 */
export default SortableContainer(props => {
  return (
    <List>
      {props.add &&
      <SortableTodo index={-1}
        edit
        superkey={-1}
        handleCreateUpdate={props.handleCreate}
        handleDelete={props.handleDelete}
        value={props.addvalue} />
      }
      {props.items.map((value, index) => {
        return <SortableTodo handleDelete={props.handleDelete}
          handleCreateUpdate={props.handleUpdate}
          superkey={index}
          key={index}
          edit={false}
          index={index}
          value={value} />;
      }
      )}
    </List>
  );
});
