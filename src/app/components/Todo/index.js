import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Input, { InputLabel } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import SaveIcon from 'material-ui-icons/Save';
import EditIcon from 'material-ui-icons/Edit';
import { teal } from 'material-ui/colors';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';

/**
 * Styles for ItemTodo
 * @param theme
 */
const styles = theme => ({
  priority0: {
    minWidth: '300px',
    background: teal[100],
    '&:hover': {
      background: teal[100],
      opacity: 1
    }
  },
  priority1: {
    minWidth: '300px',
    background: teal[200],
    '&:hover': {
      background: teal[200],
      opacity: 1
    }
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },

  priority2: {
    minWidth: '300px',
    background: teal[300],
    '&:hover': {
      background: teal[300],
      opacity: 1
    }
  }
});

/**
 * TodoItem
 */
class T extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.item,
      edit: props.edit,
      add: props.add,
      error: [false, false]
    };
    this.handleTitle = this.handleTitle.bind(this);
    this.handlePriority = this.handlePriority.bind(this);
    this.handleState = this.handleState.bind(this);
    this.setEdit = this.setEdit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleTitle(e) {
    this.state.error[0] = false;
    this.state.item.title = e.target.value;
    if (e.target.value.trim() === '' || e.target.value.trim().length > 50) {
      this.state.error[0] = true;
    }
    this.forceUpdate();
  }

  handleUpdate(e) {
    this.state.error = [false, false];
    if (e.target.title.value.trim() === '') {
      this.state.error[0] = true;
    }
    try {
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      let checkDate = new Date(e.target.term.value);
      if (currentDate > checkDate || e.target.term.value.trim() === '') {
        this.state.error[1] = true;
      }
    } catch (e) {
      this.state.error[1] = true;
    }
    if (this.state.error[0] || this.state.error[1]) {
      e.preventDefault();
      this.forceUpdate();
    } else {
      let newObj = {
        'title': e.target.title.value.trim(),
        'priority': Number(e.target.priority.value),
        'state': Number(e.target.state.value),
        'term': e.target.term.value,
        '_id': this.state.item._id
      };
      newObj.position = this.state.item.position;
      newObj._id = this.state.item._id;
      e.preventDefault();
      this.props.handleCreateUpdate(newObj, this.props.index);
    }
  }

  handlePriority(e) {
    this.state.item.priority = e.target.value;
    this.forceUpdate();
  }

  handleState(e) {
    this.state.item.state = e.target.value;
    this.forceUpdate();
  }

  setEdit() {
    this.state.edit = !this.state.edit;
    this.forceUpdate();
  }

  render() {
    return <ListItem divider className={this.props.classes[`priority${this.state.item.priority}`]}
      key={this.props.index}
      dense
      button
    >
      {!this.state.edit &&
      <div>

        <ListItemText primary={this.props.item.title}
          secondary={new Date(this.props.item.term).toLocaleDateString()} />
        <ListItemSecondaryAction>
          <IconButton aria-label='Edit'>
            <EditIcon onClick={this.setEdit} />
          </IconButton>
          <IconButton aria-label='Delete'>
            <DeleteIcon onClick={e => this.props.handleDelete(this.props.item)} />
          </IconButton>
        </ListItemSecondaryAction>
      </div>
      }

      {this.state.edit &&
      <form noValidate autoComplete='off' onSubmit={this.handleUpdate}>
        <TextField
          required
          id='name'
          error={this.state.error[0]}
          label='Title'
          name='title'
          value={this.props.item.title}
          onChange={this.handleTitle}
          margin='normal'
        />
        <FormControl>
          <InputLabel htmlFor='age-simple'>Priority</InputLabel>
          <Select

            name='priority'
            value={this.props.item.priority}
            onChange={this.handlePriority}
            input={<Input id='age-simple' />}
          >
            <MenuItem value={2}>High</MenuItem>
            <MenuItem value={1}>Middle</MenuItem>
            <MenuItem value={0}>Low</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor='age-simple'>State</InputLabel>
          <Select
            name='state'
            value={this.props.item.state}
            onChange={this.handleState}
            input={<Input id='age-simple' />}
          >
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={2}>Resolved</MenuItem>
            <MenuItem value={3}>Closed</MenuItem>
            <MenuItem value={0}>New</MenuItem>
          </Select>
        </FormControl>
        <TextField
          required
          error={this.state.error[1]}
          id='date'
          label='Term'
          type='date'
          name='term'
          defaultValue={this.props.item.term.slice(0, 10)}
          InputLabelProps={{
            shrink: true
          }}
        />
        <ListItemSecondaryAction>
          <IconButton aria-label='Save' type='submit'>
            <SaveIcon />
          </IconButton>

        </ListItemSecondaryAction>
      </form>
      }
    </ListItem>;
  }
}

T.propTypes = {
  title: PropTypes.string,
  item: PropTypes.object,
  edit: PropTypes.bool,
  add: PropTypes.bool,
  handleCreateUpdate: PropTypes.func,
  handleDelete: PropTypes.func,
  index: PropTypes.number,
  classes: PropTypes.object
};
const Todo = props => <T {...props} />;

export default withStyles(styles)(Todo);
