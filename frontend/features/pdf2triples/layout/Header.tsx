import { Divider, Stack } from "@mui/material";
import React from "react";

export const headerHeight = 75;

export default function Header({
  textInputToolbar,
  triplesToolbar,
}: {
  textInputToolbar: React.ReactNode;
  triplesToolbar: React.ReactNode;
}) {
  const [scrolledY, setScrolledY] = React.useState(0);
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolledY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollThreshold = 20;
  const didScroll = scrolledY > scrollThreshold;
  return (
    <header>
      <Stack
        direction={"row"}
        id="header"
        gap={2}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: headerHeight,
          background: "linear-gradient(90deg, #fff 50%, #f7f7f7 50%)",
          width: "100%",
          boxSizing: "border-box",
          overflowX: "hidden",
          gap: 0,
          outline: "1px solid #ddd",
          outlineWidth: didScroll ? "0 0 1px 0" : "0",
          boxShadow: didScroll ? "0 1px 4px rgba(0,0,0,0.2)" : "none",
          transition: "all 0.2s ease",
        }}
        display={"grid"}
        gridTemplateColumns={"1fr 1px 1fr"}
      >
        <HeaderSlot>{textInputToolbar}</HeaderSlot>
        <Divider orientation="vertical" flexItem />
        <HeaderSlot>{triplesToolbar}</HeaderSlot>
      </Stack>
    </header>
  );
}

function HeaderSlot({ children }: { children: React.ReactNode }) {
  return (
    <Stack
      direction={"row"}
      display={"flex"}
      alignItems={"center"}
      padding={"32px"}
      boxSizing={"border-box"}
      overflow={"hidden"}
    >
      {children}
    </Stack>
  );
}

export function HeaderSpacer() {
  return <div style={{ height: headerHeight }} />;
}
