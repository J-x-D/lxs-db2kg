import { useEffect, useState } from "react";

export const useActiveElement = () => {
  const [active, setActive] = useState(document.activeElement);

  useEffect(() => {
    setActive(document.activeElement);
  }, [document])

  const handleFocusIn = (e: FocusEvent) => {
    setActive(document.activeElement);
  };

  useEffect(() => {
    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  return active;
};
