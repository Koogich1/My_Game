"use client"

import React, { useState, useEffect, useRef } from 'react';

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
	const [dimensions, setDimensions] = useState({width: 0, height: 0})
	const [cubePosition, setCubePosition] = useState({y: 0, x: 0})
	const [mousePosition, setMousePosition] = useState({ y: 0, x: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
	const elementRef = useRef<HTMLDivElement>(null)


  const gravity = 0.5;
  const bounceFactor = 0.3;
  const friction = 0.65;

  useEffect(() => {
    const initializePositions = () => {
      if (sectionRef.current) {
        const initialPositions: Positions = {};
					setDimensions({
						width: sectionRef.current.offsetWidth,
						height: sectionRef.current.offsetHeight
					});
        React.Children.forEach(children, (child, index) => {
          const elementId = index;
					if(sectionRef.current == null)return
          initialPositions[elementId] = {
            x: cubePosition.x, // Use optional chaining and fallback
            y: cubePosition.y, // Use optional chaining and fallback
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
  }, [children]);

  useEffect(() => {
    if (Object.keys(positions).length === 0) return;

    let animationFrameId: number;

    const animate = () => {
      setPositions(prevPositions => {
        const updatedPositions: Positions = {};

        for (const elementId in prevPositions) {
          if (!prevPositions.hasOwnProperty(elementId)) continue;

          let { x, y, velocityY } = prevPositions[elementId];

          velocityY += gravity;
          y += velocityY;

          if (sectionRef.current && y + 50 > (sectionRef.current.offsetHeight ?? 0)) { //Use optional chaining and fallback
            y = (sectionRef.current.offsetHeight ?? 0) - 50; //Use optional chaining and fallback
            velocityY = -velocityY * bounceFactor;
          }

          velocityY *= friction;

          updatedPositions[elementId] = { x, y, velocityY };
					setCubePosition({x, y})
        }

        return updatedPositions;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [positions]);

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

	const handleClick = () => {
    setPositions(prevPositions => {
      const newPositions = { ...prevPositions };
      newPositions[0] = { x: mousePosition.x, y: mousePosition.y, velocityY: 0 };
      return newPositions;
    });
  };


  return (
    <div 
			ref={sectionRef} 
			className='w-full h-full bg-yellow-50 relative'
			onClick={handleClick}
		>
			<div className='px-2 py-2 rounded-sm absolute left-[-190px] bg-yellow-50'>
				<p>Width: {dimensions.width}</p>
				<p>Heigth: {dimensions.height}</p>
				<h1>Object Positioning:</h1>
				<h2>{Math.floor(cubePosition.x) + " " + Math.floor(cubePosition.y)}</h2>
				<h1>Mouse Positioning:</h1>
				<h2>{mousePosition.x + " " + mousePosition.y}</h2>
			</div>
      {positionedChildren}
    </div>
  );
};

export default GravitySection;