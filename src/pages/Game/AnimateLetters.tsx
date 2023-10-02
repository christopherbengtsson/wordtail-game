import { useEffect, useState } from 'react';
import { ZoomInZoomOut } from '../../components';

export function AnimateLetters({
  letters,
  animationDuration,
}: {
  letters: string[];
  animationDuration: number;
}) {
  const [letterIndex, setLetterIndex] = useState(0);
  const [doAnimate, setDoAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (doAnimate) {
        setLetterIndex((prevIdx) => prevIdx + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [letters.length, doAnimate]);

  useEffect(() => {
    if (letterIndex === letters.length) {
      setDoAnimate(false);
    }
  }, [letters.length, letterIndex]);

  return (
    <ZoomInZoomOut
      text={letters[letterIndex]}
      iterationCount={letters.length + 1}
      duration={animationDuration}
    />
  );
}
