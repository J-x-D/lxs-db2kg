"use client";
import React, { ReactNode, useEffect, useState } from "react";

export default function InitializedStore({
  children,
}: {
  children: ReactNode;
}) {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    setInitialized(true);
  }, []);

  if (!initialized) return <></>;

  return <>{children}</>;
}
