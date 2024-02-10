const mapDuration = ({
  value,
  in_min,
  in_max,
  out_min,
  out_max,
}: {
  value: number;
  in_min: number;
  in_max: number;
  out_min: number;
  out_max: number;
}): number => {
  return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

export const estimateTimeRemaining = (tokenLen: number): number => {
  const calibrationDefaults = {
    small: {
      tokens: 73,
      duration: 4,
    },
    big: {
      tokens: 2000,
      duration: 47,
    },
  };

  const duration = mapDuration({
    value: tokenLen,
    in_min: calibrationDefaults.small.tokens,
    in_max: calibrationDefaults.big.tokens,
    out_min: calibrationDefaults.small.duration,
    out_max: calibrationDefaults.big.duration,
  });
  return duration;
};
