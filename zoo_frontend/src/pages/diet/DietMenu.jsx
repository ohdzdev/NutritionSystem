import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import MenuIcon from '@material-ui/icons/Menu';
import AddBox from '@material-ui/icons/AddBox';
import Download from '@material-ui/icons/CloudDownload';
import Mail from '@material-ui/icons/Mail';
import Delete from '@material-ui/icons/Delete';

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

function DietMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      { (
        props.mail.enabled
        || props.new.enabled
        || props.downloadDiet.enabled
        || props.delete.enabled
      ) &&
        <>
          <Button
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
            variant="contained"
          >
            Menu
            <MenuIcon className={props.classes.rightIcon} />
          </Button>
          <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            { props.mail.enabled &&
              <MenuItem onClick={() => {
                handleClose();
                props.mail.handler();
              }}
              >
                <ListItemIcon>
                  <Mail />
                </ListItemIcon>
              Ask Nutritionist About Diet
              </MenuItem>
            }
            { props.downloadDiet.enabled &&
              <MenuItem onClick={() => {
                handleClose();
                props.downloadDiet.handler();
              }}
              >
                <ListItemIcon>
                  <Download />
                </ListItemIcon>
              Download Diet Analysis
              </MenuItem>
            }
            { props.new.enabled &&
              <MenuItem onClick={() => {
                handleClose();
                props.new.handler();
              }}
              >
                <ListItemIcon>
                  <AddBox />
                </ListItemIcon>
              Create New Diet
              </MenuItem>
            }
            { props.delete.enabled &&
              <MenuItem onClick={() => {
                handleClose();
                props.delete.handler();
              }}
              >
                <ListItemIcon>
                  <Delete />
                </ListItemIcon>
              Delete Diet
              </MenuItem>
            }
          </Menu>
        </>
      }
    </>
  );
}

DietMenu.propTypes = {
  mail: PropTypes.shape({
    enabled: PropTypes.bool.isRequired,
    handler: PropTypes.func.isRequired,
  }).isRequired,
  new: PropTypes.shape({
    enabled: PropTypes.bool.isRequired,
    handler: PropTypes.func.isRequired,
  }).isRequired,
  downloadDiet: PropTypes.shape({
    enabled: PropTypes.bool.isRequired,
    handler: PropTypes.func.isRequired,
  }).isRequired,
  delete: PropTypes.shape({
    enabled: PropTypes.bool.isRequired,
    handler: PropTypes.func.isRequired,
  }).isRequired,
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(DietMenu);
