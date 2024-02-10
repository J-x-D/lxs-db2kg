"use client";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Link,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  TooltipProps,
  Typography,
  tooltipClasses,
} from "@mui/material";
import { useStore } from "store/store";
import styled from "@emotion/styled";
import theme from "src/theme";
import { Check, ContentCopy } from "@mui/icons-material";
import { Link as LinkIcon } from "@mui/icons-material";
import { hasImportedPdf } from "../../triples/utils/checks/hasImportedPdf";

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ bgColor }: { bgColor: string }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    borderRadius: "4px",
    backgroundColor: bgColor,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.background.default,
  },
}));

export default function PdfSource() {
  const {
    pdf2triplesPdfSource,
    pdf2triplesPdfWasEdited,
    pdf2triplesGlobalPdf,
  } = useStore();
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [userEdited, setUserEdited] = React.useState(false);
  const [_navigator, setNavigator] = React.useState<any>(null);

  useEffect(() => {
    setNavigator(navigator);
  }, []);

  useEffect(() => {
    setUserEdited(pdf2triplesPdfWasEdited);
  }, [pdf2triplesPdfWasEdited]);

  const handleClose = () => setTooltipOpen(false);

  const handleOpen = () => setTooltipOpen(true);

  useEffect(() => {
    if (copied) handleOpen();
  }, [copied]);

  const handleCopy = () => {
    _navigator.clipboard.writeText(pdf2triplesPdfSource);
    handleCloseContextMenu();
    setCopied(true);
    timeoutRef.current = window.setTimeout(() => {
      handleClose();
      setTimeout(() => {
        setCopied(false);
      }, 300);
    }, 1500);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 }
        : null,
    );
  };

  const handleCloseContextMenu = () => setContextMenu(null);

  const handleVisitSource = () => {
    handleCloseContextMenu();
    window.open(pdf2triplesPdfSource, "_blank");
  };

  if (hasImportedPdf(pdf2triplesGlobalPdf) && pdf2triplesPdfSource === "")
    return <AlertImportedPdfNoSource />;
  if (pdf2triplesPdfSource === "") return null;
  if (pdf2triplesPdfSource === "string") {
    return (
      <Typography
        variant={"body2"}
        color={"GrayText"}
        sx={{ whiteSpace: "nowrap" }}
      >
        Manual entry
      </Typography>
    );
  }
  return (
    <>
      <Stack
        direction={"row"}
        alignItems={"baseline"}
        gap={0.2}
        flex={1}
        boxSizing={"border-box"}
        overflow={"hidden"}
      >
        <Typography
          variant={"body2"}
          color={"GrayText"}
          sx={{ whiteSpace: "nowrap" }}
        >
          PDF source {userEdited ? " (user edited)" : " "}:
        </Typography>
        <CustomTooltip
          onContextMenu={handleContextMenu}
          title={
            copied ? (
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <Check sx={{ fontSize: "0.875rem" }} />
                Copied!
              </Stack>
            ) : (
              "Copy to clipboard"
            )
          }
          placement="right"
          arrow
          open={tooltipOpen}
          onMouseOver={handleOpen}
          onMouseLeave={() => !copied && handleClose()}
          bgColor={copied ? "#4caf50" : theme.palette.text.secondary}
        >
          <Link
            onClick={handleCopy}
            underline="hover"
            variant="body2"
            sx={{
              opacity: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "context-menu",
            }}
          >
            {pdf2triplesPdfSource}
          </Link>
        </CustomTooltip>
      </Stack>
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={handleCopy}
          sx={{
            gap: 1,
          }}
        >
          <ContentCopy fontSize="small" />
          Copy
        </MenuItem>
        <MenuItem
          onClick={handleVisitSource}
          sx={{
            gap: 1,
          }}
        >
          <LinkIcon fontSize="small" /> Visit
        </MenuItem>
      </Menu>
    </>
  );
}

function AlertImportedPdfNoSource() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <Alert severity="error" onClose={() => setShow(false)}>
      You have imported a PDF but the source is not available. Please import the
      PDF again.
    </Alert>
  );
}
