import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
});

class CustomFormCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.value,
    };
  }

  handleChange() {
    this.setState((prevState) => ({
      checked: !prevState.checked,
    }), () => {
      this.props.onChange(this.state.checked);
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <FormControl required error={this.props.error} component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Pick two</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={this.props.value} onChange={() => this.handleChange()} value={this.props.label} />
              }
              label={this.props.label}
            />
          </FormGroup>
          <FormHelperText>{this.props.helperText}</FormHelperText>
        </FormControl>
      </div>
    );
  }
}

CustomFormCheckbox.propTypes = {
  classes: PropTypes.object.isRequired,
  helperText: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  error: PropTypes.string.isRequired,
};

CustomFormCheckbox.defaultProps = {
  onChange: () => {},
};

export default withStyles(styles)(CustomFormCheckbox);
