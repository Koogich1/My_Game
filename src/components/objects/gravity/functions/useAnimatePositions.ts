import { useEffect } from 'react';

interface Position {
  x: number;
  y: number;
  velocityY: number;
}

interface Positions {
  [key: number]: Position;
}

const useAnimatePositions = (
  positions: Positions,
  setPositions: React.Dispatch<React.SetStateAction<Positions>>,
  setCubePosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
  moveLeft: boolean,
  moveRight: boolean,
  isJumping: boolean,
  setIsJumping: React.Dispatch<React.SetStateAction<boolean>>,
  timeInAir: number,
  setTimeInAir: React.Dispatch<React.SetStateAction<number>>,
  gravity: number,
  sectionRef: React.RefObject<HTMLDivElement | null>,
  bounceFactor: number,
  friction: number,
  playerSpeed: number,
  setFps: React.Dispatch<React.SetStateAction<number>>,
  previousTimestamp: { current: number },
  frameCount: { current: number }
) => {
  useEffect(() => {
    if (Object.keys(positions).length === 0) return;

    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (previousTimestamp.current === 0) previousTimestamp.current = timestamp;

      frameCount.current++;

      const deltaTime = timestamp - previousTimestamp.current;
      if (deltaTime >= 1000) {
        setFps(frameCount.current);
        frameCount.current = 0;
        previousTimestamp.current = timestamp;
      }

      setPositions(prevPositions => {
        const updatedPositions: Positions = {};

        for (const elementId in prevPositions) {
          if (!prevPositions.hasOwnProperty(elementId)) continue;

          let { x, y, velocityY } = prevPositions[elementId];

          // Управление движением
          if (moveLeft) {
            x -= playerSpeed;
          }
          if (moveRight) {
            x += playerSpeed;
          }

          // Логика гравитации и прыжка
          if (isJumping && timeInAir === 0) {
            velocityY = -60;
            setIsJumping(false);
            setTimeInAir(1);
          }

          velocityY += gravity + timeInAir;
          y += velocityY;

          if (sectionRef.current && y + 50 > (sectionRef.current.offsetHeight ?? 0)) {
            setTimeInAir(0);
            y = (sectionRef.current.offsetHeight ?? 0) - 50;
            velocityY = -velocityY * bounceFactor;
          }

          velocityY *= friction;

          updatedPositions[elementId] = { x, y, velocityY };
          setCubePosition({ x, y });
        }

        return updatedPositions;
      });

      setTimeInAir(prevTime => prevTime + 0.01 * 5);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [positions, moveLeft, moveRight, isJumping]);
};

export default useAnimatePositions;
