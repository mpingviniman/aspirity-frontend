import React from 'react';
import Todo from '../Todo';
import {SortableElement} from 'react-sortable-hoc';

/**
 * SortableItem
 */
export default SortableElement(props => {
  return <Todo edit={props.edit}
    superkey={props.superkey}
    sorting={props.sorting}
    item={props.value}
    handleCreateUpdate={props.handleCreateUpdate}
    handleDelete={props.handleDelete} />;
}
);
