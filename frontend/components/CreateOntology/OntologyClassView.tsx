import { OntologyClass } from "types/OntologyClass";
import {
  ExpandLess,
  ExpandMore,
  MoreVert,
} from "@mui/icons-material";
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export default function OntologyClassView({
  classes,
  baseIRI,
  setDefaultClass,
  deleteClass,
}: {
  classes: OntologyClass[];
  baseIRI: string;
  setDefaultClass: (ontologyClass: OntologyClass) => void;
  deleteClass: (ontologyClass: OntologyClass) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const [open, setOpen] = useState(classes.map(() => false));
  const [selectedClass, setSelectedClass] = useState<OntologyClass | null>(
    null
  );

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    ontologyClass: OntologyClass
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedClass(ontologyClass);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedClass(null);
  };

  const handleDefaultClass = (ontologyClass: OntologyClass) => {
    setDefaultClass(ontologyClass);
    handleMenuClose();
  };

  const handleDeleteClass = (ontologyClass: OntologyClass) => {
    deleteClass(ontologyClass);
    handleMenuClose();
  };

  return (
    <Paper variant="outlined" sx={{ width: "50%", p: 2 }}>
      <Typography variant="subtitle2">Class List</Typography>
      <List sx={{ width: "100%", height: "100%" }}>
        {classes.length === 0 ? (
          <Typography
            variant="body2"
            style={{
              color: "#808080",
              backgroundColor: "#F7F7F7",
              padding: "1rem",
              borderRadius: "20px",
            }}
          >
            No classes added yet
          </Typography>
        ) : (
          classes.map((c, index) => {
            const isMenuOpen = selectedClass === c && menuOpen;
            return (
              <React.Fragment key={c.name}>
                <ListItem>
                  <ListItemText
                    primary={`Class ${c.name}`}
                    secondary={c.subClassOf && `Subclass of ${c.subClassOf}`}
                  />
                  <IconButton
                    onClick={() => {
                      setOpen((prev) => {
                        const copy = [...prev];
                        copy[index] = !copy[index];
                        return copy;
                      });
                    }}
                  >
                    {open[index] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                  <IconButton onClick={(e) => handleMenuOpen(e, c)}>
                    <MoreVert />
                  </IconButton>
                </ListItem>
                <Collapse in={open[index]} timeout="auto" unmountOnExit>
                  {c.properties.length > 0 &&
                    c.properties.map((a) => (
                      <ListItemText
                        sx={{ pl: 4 }}
                        key={
                          (a["DatatypeProperty"] ?? a["ObjectProperty"] ?? "") +
                            a.type ?? a.range
                        }
                        primary={`${baseIRI}#${
                          a["DatatypeProperty"] ?? a["ObjectProperty"] ?? ""
                        }`}
                        secondary={a.type ?? a.range}
                      />
                    ))}
                </Collapse>
              </React.Fragment>
            );
          })
        )}
      </List>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {selectedClass && (
          <MenuItem onClick={() => handleDefaultClass(selectedClass)}>
            Edit {selectedClass.name}
          </MenuItem>
        )}
        {selectedClass && (
          <MenuItem onClick={() => handleDeleteClass(selectedClass)}>
            Delete
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
}
