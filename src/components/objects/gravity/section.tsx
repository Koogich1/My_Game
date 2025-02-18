"use client"

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import usePlayerMovement from './functions/PlayerMovement';
import useInitializePositions from './functions/initializePositions';
import useAnimatePositions from './functions/useAnimatePositions';


interface Position {
  x: number;
  y: number;
  velocityY: number;
}

interface Positions {
  [key: number]: Position;
}

const GravitySection = ({ children }: { children: React.ReactNode; }) => {
    const [positions, setPositions] = useState<Positions>({});
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [cubePosition, setCubePosition] = useState({ y: 0, x: 0 });
    const [mousePosition, setMousePosition] = useState({ y: 0, x: 0 });
    const [timeInAir, setTimeInAir] = useState(0);
    const [fps, setFps] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);
    const elementRef = useRef<HTMLDivElement>(null);
    const previousTimestamp = useRef(0);

    const [gravity, setGravity] = useState(0.8)

    const bounceFactor = 0.3;
    const friction = 0.65;
    const frameCount = useRef(0);

    const [isJumping, setIsJumping] = useState(false);
    const [moveLeft, setMoveLeft] = useState(false);
    const [moveRight, setMoveRight] = useState(false);
    const playerSpeed = 5;

    usePlayerMovement(setMoveLeft, setMoveRight, setIsJumping);

    useInitializePositions(sectionRef, children, cubePosition, setDimensions, setPositions);

    useAnimatePositions(
      positions,
      setPositions,
      setCubePosition,
      moveLeft,
      moveRight,
      isJumping,
      setIsJumping,
      timeInAir,
      setTimeInAir,
      gravity,
      sectionRef,
      bounceFactor,
      friction,
      playerSpeed,
      setFps,
      previousTimestamp,
      frameCount
    );


  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

    const positionedChildren = React.Children.map(children, (child, index) => {
      const elementId = index;
      const position = positions[elementId] || { x: 0, y: 0, velocityY: 0 };

      return (
        <div
          ref={elementRef}
          key={elementId}
          style={{
            position: 'absolute',
            left: position.x,
            top: position.y,
            width: '50px',
            height: '50px',
            backgroundColor: 'red',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
          }}
        >
          {child}
        </div>
      );
    });
    

    const handleClick = () => {
      setPositions(prevPositions => {
        const newPositions = { ...prevPositions };
        newPositions[0] = { x: mousePosition.x, y: mousePosition.y, velocityY: 0 };
        return newPositions;
      });
    };

    const handleChangeGravity = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      if(value === ''){
        setGravity(0)
      } else{
        setGravity(parseFloat(value))
      }
    }

    return (
      <>
        <div className='px-2 py-2 rounded-sm absolute left-0 bg-yellow-50'>
          <p>Width: {dimensions.width}</p>
          <p>Height: {dimensions.height}</p>
          <h1>Object Positioning:</h1>
          <h2>{Math.floor(cubePosition.x) + " " + Math.floor(cubePosition.y)}</h2>
          <h1>Object speed:</h1>
          <h2>{positions[0] ? Math.ceil(positions[0].velocityY) : 0} px/s</h2>
          <h1>Mouse Positioning:</h1>
          <h2>{Math.floor(mousePosition.x) + " " + Math.floor(mousePosition.y)}</h2>
          <h1>FPS:</h1>
          <h2>{fps}</h2>
        </div>

        <div className='px-2 py-2 rounded-sm absolute left-0 mt-[280px] bg-yellow-50'>
          <h1>Settings</h1>
          <h3>Gravity:</h3>
          <input 
            type="text" 
            value={gravity} 
            onChange={handleChangeGravity}
          />
        </div>
        <div 
          ref={sectionRef} 
          className='w-full h-full bg-yellow-50 relative'
          onClick={handleClick}
        >
          {positionedChildren}
        </div>
      </>
    );
  };

  export default GravitySection;