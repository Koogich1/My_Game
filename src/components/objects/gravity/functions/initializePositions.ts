import { useEffect, useRef } from 'react';
import React from 'react';

interface Position {
  x: number;
  y: number;
  velocityY: number;
}

interface Positions {
  [key: number]: Position;
}

const useInitializePositions = (
  sectionRef: React.RefObject<HTMLDivElement | null>,
  children: React.ReactNode,
  cubePosition: { x: number; y: number },
  setDimensions: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>,
  setPositions: React.Dispatch<React.SetStateAction<Positions>>
) => {
  useEffect(() => {
    const initializePositions = () => {
      if (sectionRef.current) {
        const initialPositions: Positions = {};
        setDimensions({
          width: sectionRef.current.offsetWidth,
          height: sectionRef.current.offsetHeight,
        });

        React.Children.forEach(children, (child, index) => {
          const elementId = index;
          initialPositions[elementId] = {
            x: cubePosition.x,
            y: cubePosition.y,
            velocityY: 0,
          };
        });

        setPositions(initialPositions);
      }
    };

    if (sectionRef.current) {
      initializePositions();
    } else {
      requestAnimationFrame(initializePositions);
    }
  }, [children, setDimensions, setPositions, cubePosition, sectionRef]);
};

export default useInitializePositions;