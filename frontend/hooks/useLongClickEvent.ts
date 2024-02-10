import { useCallback, useRef, useState, SyntheticEvent } from "react";

interface LongClickEventOptions {
  shouldPreventDefault?: boolean;
  delay?: number;
}

const useLongClickEvent = (
  onLongPress: (event: SyntheticEvent) => void,
  onClick: () => void,
  { shouldPreventDefault = true, delay = 300 }: LongClickEventOptions = {}
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<number | null>(null);
  const target = useRef<EventTarget | null>(null);

  const start = useCallback(
    (event: SyntheticEvent) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener("touchend", preventDefault, {
          passive: false,
        });
        target.current = event.target;
      }
      timeout.current = window.setTimeout(() => {
        onLongPress(event);
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (event: SyntheticEvent, shouldTriggerClick = true) => {
      if (timeout.current) {
        window.clearTimeout(timeout.current);
      }
      shouldTriggerClick && !longPressTriggered && onClick();
      setLongPressTriggered(false);
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener("touchend", preventDefault);
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered]
  );

  return {
    onMouseDown: (e: SyntheticEvent) => start(e),
    onTouchStart: (e: SyntheticEvent) => start(e),
    onMouseUp: (e: SyntheticEvent) => clear(e),
    onMouseLeave: (e: SyntheticEvent) => clear(e, false),
    onTouchEnd: (e: SyntheticEvent) => clear(e),
  };
};

const isTouchEvent = (event: Event): event is TouchEvent => {
  return "touches" in event;
};

const preventDefault = (event: Event) => {
  if (!isTouchEvent(event)) return;

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};

export default useLongClickEvent;
