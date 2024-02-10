import { useStore } from "store/store";
import { Close, TipsAndUpdatesOutlined } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import React, { useEffect } from "react";
import useLongClickEvent from "hooks/useLongClickEvent";

type ValueText = string | React.ReactNode;

interface GuidanceInfoAlertProps {
  title?: ValueText;
  text: ValueText;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export default function GuidanceInfoAlert({
  text,
  title,
  children,
  icon = <TipsAndUpdatesOutlined />,
}: GuidanceInfoAlertProps) {
  const { showGuidance, setShowGuidance } = useStore();
  const [show, setShow] = React.useState(showGuidance);
  const alertRef = React.useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onLongPress = () => {
    setAnchorEl(alertRef.current);
  };

  const onClick = () => {
    setShow(false);
  };

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };
  const longPressEvent = useLongClickEvent(
    onLongPress,
    onClick,
    defaultOptions,
  );

  useEffect(() => {
    setShow(showGuidance);
  }, [showGuidance]);

  const MainComp = (
    <>
      <Collapse in={show} unmountOnExit>
        <Alert
          severity="info"
          icon={icon}
          onClose={() => setShow(false)}
          sx={{
            alignItems: "center",
            "& .MuiAlert-message": {
              alignItems: "center",
            },
            "& .MuiAlert-action": {
              alignItems: "center",
              paddingTop: 0,
            },
          }}
          action={
            <Stack direction="row" gap={1} alignItems={"center"} ref={alertRef}>
              {/* Hide only this Guidance */}
              <IconButton
                {...longPressEvent}
                sx={{
                  height: "max-content",
                }}
                size="small"
                aria-label="close"
                color="inherit"
              >
                <Close fontSize="inherit" />
              </IconButton>
            </Stack>
          }
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {text}
        </Alert>
      </Collapse>
      <Menu
        id="hide-guidance-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "hide-guidance-menu",
        }}
      >
        <MenuItem
          onClick={() => {
            setShowGuidance(false);
            handleClose();
          }}
        >
          Hide All Guidances
        </MenuItem>
      </Menu>
    </>
  );
  return children ? (
    <Stack gap={2} width={"100%"}>
      {MainComp}
      {children}
    </Stack>
  ) : (
    MainComp
  );
}
