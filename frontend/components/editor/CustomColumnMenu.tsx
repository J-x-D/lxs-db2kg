import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from "@mui/material";
import {
  GridColumnMenu,
  GridColumnMenuItemProps,
  GridColumnMenuProps,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";

export default function CustomColumnMenu(props: GridColumnMenuProps) {
  const [open, setOpen] = useState(false);

  const { colDef } = props;
  const tableName = colDef.field;

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Creating RML Rules</DialogTitle>
        <DialogContent>...</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disableElevation
            onClick={() => setOpen(false)}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
      <GridColumnMenu {...props} />
    </>
  );
}

function CustomUserItem(props: GridColumnMenuItemProps) {
  const { myCustomHandler, myCustomValue } = props;
  return (
    <MenuItem onClick={myCustomHandler}>
      <ListItemIcon>
        <EditIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{myCustomValue}</ListItemText>
    </MenuItem>
  );
}
