import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

interface BaseDialogProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleClose: () => void;
  open: boolean;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}

export default function BaseDialog({
    handleSubmit,
    handleClose,
  open,
  title,
  subtitle,
  children,
  isLoading,
}: BaseDialogProps) {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {subtitle && <DialogContentText>{subtitle}</DialogContentText>}
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            loading={!!isLoading}
            type="submit"
            startIcon={<Add />}
          >
            Add
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
