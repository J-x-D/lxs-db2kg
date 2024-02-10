import { MenuItem, MenuItemProps, Stack, StackOwnProps } from "@mui/material";
import React from "react";

interface ImportTriplesMenuItemProps {
  handleClick: () => void;
  tooltipLabel: string;
  disabled?: boolean;
  children: React.ReactNode;
  placement?:
    | "bottom"
    | "left"
    | "right"
    | "top"
    | "bottom-end"
    | "bottom-start"
    | "left-end"
    | "left-start"
    | "right-end"
    | "right-start"
    | "top-end"
    | "top-start"
    | undefined;
  sx?: StackOwnProps["sx"];
}

const BaseMenuItem = React.forwardRef<MenuItemProps, any>((props, ref) => (
  <MenuItem
    ref={ref}
    sx={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "1rem",
      height: "48px",
    }}
    {...props}
  />
));
BaseMenuItem.displayName = "BaseMenuItem";

export default function BaseOverflowMenuItem({
  handleClick,
  tooltipLabel,
  disabled = false,
  children,
  placement = "bottom",
  sx,
}: ImportTriplesMenuItemProps) {
  return (
    <span>
      <BaseMenuItem onClick={handleClick} disabled={disabled}>
        <Stack
          sx={sx}
          direction="row"
          alignItems="center"
          justifyContent={"flex-end"}
          gap={2}
        >
          {children}
        </Stack>
      </BaseMenuItem>
    </span>
  );
}
