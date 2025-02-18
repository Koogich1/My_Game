import { useEffect } from 'react';

const usePlayerMovement = (
  setMoveLeft: React.Dispatch<React.SetStateAction<boolean>>,
  setMoveRight: React.Dispatch<React.SetStateAction<boolean>>,
  setIsJumping: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        setMoveLeft(true);
        break;
      case 'ArrowRight':
        setMoveRight(true);
        break;
      case ' ':
        setIsJumping(true);
        break;
      default:
        break;
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        setMoveLeft(false);
        break;
      case 'ArrowRight':
        setMoveRight(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
};

export default usePlayerMovement;