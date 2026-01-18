
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Play } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

interface GameCanvasProps {
    DogIcon: React.FC<React.SVGProps<SVGSVGElement>>;
    PillIcon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const GameCanvas = ({ DogIcon, PillIcon }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const dogImageRef = useRef<HTMLImageElement | null>(null);
  const pillImageRef = useRef<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dogSvgString = renderToStaticMarkup(<DogIcon />);
    const dogImage = new Image();
    dogImage.src = `data:image/svg+xml;base64,${window.btoa(dogSvgString)}`;
    dogImage.onload = () => {
      dogImageRef.current = dogImage;
      if (pillImageRef.current) setIsLoading(false);
    };

    const pillSvgString = renderToStaticMarkup(<PillIcon />);
    const pillImage = new Image();
    pillImage.src = `data:image/svg+xml;base64,${window.btoa(pillSvgString)}`;
    pillImage.onload = () => {
      pillImageRef.current = pillImage;
      if (dogImageRef.current) setIsLoading(false);
    };

  }, [DogIcon, PillIcon]);

  useEffect(() => {
    if (!gameStarted || isLoading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let gravity = 0.5;
    let ground = 350;

    const dog = {
      x: 50,
      y: ground - 40,
      width: 40,
      height: 40,
      dy: 0,
      jumpPower: -10,
      grounded: true,
    };

    let pills: any[] = [];
    let score = 0;
    let animationFrameId: number;

    function spawnPill() {
      if(!canvas) return;
      const pill = {
        x: canvas.width,
        y: ground - 30,
        width: 30,
        height: 30,
        speed: 5,
      };
      pills.push(pill);
    }

    function updateDog() {
      dog.y += dog.dy;
      dog.dy += gravity;

      if (dog.y + dog.height >= ground) {
        dog.y = ground - dog.height;
        dog.dy = 0;
        dog.grounded = true;
      }
    }

    function updatePills() {
      pills.forEach((pill) => {
        pill.x -= pill.speed;
      });

      pills = pills.filter((pill) => pill.x + pill.width > 0);
    }

    function detectCollision() {
      for (let pill of pills) {
        if (
          dog.x < pill.x + pill.width &&
          dog.x + dog.width > pill.x &&
          dog.y < pill.y + pill.height &&
          dog.y + dog.height > pill.y
        ) {
          // Instead of alert, we just stop the game
          setGameStarted(false);
          return;
        }
      }
    }

    function drawDog() {
       if(!ctx || !dogImageRef.current) return;
       ctx.drawImage(dogImageRef.current, dog.x, dog.y, dog.width, dog.height);
    }

    function drawPills() {
       if(!ctx || !pillImageRef.current) return;
      pills.forEach((pill) => {
        if (pillImageRef.current) {
            ctx.drawImage(pillImageRef.current, pill.x, pill.y, pill.width, pill.height);
        }
      });
    }

    function drawScore() {
        if(!ctx) return;
      ctx.fillStyle = "#000";
      ctx.font = "20px Arial";
      ctx.fillText("Score: " + score, 10, 25);
    }
    
    function drawGround() {
        if(!ctx || !canvas) return;
        ctx.fillStyle = '#654321'; // Brown color for ground
        ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
    }


    function gameLoop() {
      if(!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#b8e994';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      drawGround();

      updateDog();
      updatePills();
      
      drawDog();
      drawPills();
      drawScore();
      
      detectCollision(); // check collision after drawing everything

      score++;

      animationFrameId = requestAnimationFrame(gameLoop);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && dog.grounded) {
        e.preventDefault(); // Prevent page from scrolling
        dog.dy = dog.jumpPower;
        dog.grounded = false;
      }
    };
    
    const handleTouchStart = (e: TouchEvent) => {
        if (dog.grounded) {
            e.preventDefault();
            dog.dy = dog.jumpPower;
            dog.grounded = false;
        }
    };

    document.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("touchstart", handleTouchStart);
    const pillInterval = setInterval(spawnPill, 1500);
    
    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(pillInterval);
      document.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("touchstart", handleTouchStart);
    };
  }, [gameStarted, isLoading]);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="relative w-full h-full">
      <canvas 
          ref={canvasRef} 
          width="800" 
          height="400"
          className="w-full h-full border-4 border-primary rounded-lg bg-[#b8e994]"
      ></canvas>
      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <Button onClick={startGame} size="lg" disabled={isLoading}>
            {isLoading ? 'Loading Assets...' : <><Play className="mr-2" /> Play Game</>}
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;
