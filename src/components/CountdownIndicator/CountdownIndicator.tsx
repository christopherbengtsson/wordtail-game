import { useEffect, useState } from 'react';
import { ProgressBar } from 'react95';
import { Body } from '..';

export interface CountdownIndicatorProps {
  duration: number;
  onTimeUp: () => void; // New prop for the callback function
}

const intervalTime = 500;

export function CountdownIndicator({
  duration,
  onTimeUp,
}: CountdownIndicatorProps) {
  const [percent, setPercent] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const totalIntervals = duration / intervalTime;

  useEffect(() => {
    const timer = setInterval(() => {
      // Increment elapsed time
      setElapsedTime((prev) => prev + intervalTime);

      if (elapsedTime + intervalTime >= duration && percent < 100) {
        clearInterval(timer);
        setPercent(100);
        onTimeUp(); // Call the callback when time is up
        return;
      }

      const avgIncrease = (100 - percent) / (totalIntervals * 0.75); // Increase the denominator to make the increments slightly larger
      const diff = Math.random() * (2.5 * avgIncrease); // Increase the upper limit of the random factor
      setPercent((prev) => Math.min(prev + diff, 100));
    }, intervalTime);

    return () => {
      clearInterval(timer);
    };
  }, [duration, totalIntervals, elapsedTime, percent, onTimeUp]);

  const secondsLeft = Math.ceil((duration - elapsedTime) / 1000);

  return (
    <>
      {/** TODO: variant with a/b testing? */}
      <ProgressBar variant="tile" value={Math.floor(percent)} />
      <Body>{secondsLeft > 0 ? `${secondsLeft} seconds left` : ''}</Body>
    </>
  );
}
