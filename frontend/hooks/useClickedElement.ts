import { useEffect, useState } from "react";

export const useClickedElement = () => {
  const [clicked, setClicked] = useState(document.activeElement);

  const handleClick = (e: MouseEvent) => {
    setClicked(e.target as HTMLElement);
  };

  useEffect(() => {
    setClicked(document.activeElement);
  }, [document])

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return clicked;
};
