'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Volume2, VolumeX } from 'lucide-react';

// Farm maze layout (0 = grass, 1 = dirt path, 2 = farm entrance, 3 = farm exit)
const FARM_MAZE = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 3],
  [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const CELL_SIZE = 65;

interface Position {
  x: number;
  y: number;
}

export default function MazePage() {
  const router = useRouter();
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 1 }); // Farm entrance position
  const [playerDirection, setPlayerDirection] = useState<'down' | 'up' | 'left' | 'right'>('down'); // Track facing direction
  const [isWalking, setIsWalking] = useState(false); // Track if character is walking
  const [showFog, setShowFog] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Immediate mobile detection - happens before render
  useEffect(() => {
    // Quick synchronous mobile check
    const userAgent = navigator.userAgent;
    const isMobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isMobileScreen = window.innerWidth <= 768 && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    if (isMobileUA || isMobileScreen) {
      // Immediate redirect - no state update needed
      router.replace('/home');
      return;
    }
    
    setIsMobile(false); // Only set state if not mobile
  }, [router]);

  // Check if player reached the end
  useEffect(() => {
    if (FARM_MAZE[playerPos.y][playerPos.x] === 3 && !gameWon) {
      setGameWon(true);
      setShowFog(true);
      
      // Show Thank You after a brief delay for smoother transition
      setTimeout(() => {
        setShowThankYou(true);
      }, 500);
      
      // Navigate to home page after longer duration for seamless experience
      setTimeout(() => {
        router.push('/home');
      }, 3500); // Increased from 2000 to 3500 for better pacing
    }
  }, [playerPos, gameWon, router]);

  // Toggle music function
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Auto-play music when component mounts
  useEffect(() => {
    const startAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('Auto-play failed:', error);
          setIsPlaying(false);
        }
      }
    };
    
    // Delay slightly to ensure audio element is ready
    const timer = setTimeout(startAudio, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle keyboard input
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameWon) return;

    const { key } = event;
    let newX = playerPos.x;
    let newY = playerPos.y;
    let direction: 'down' | 'up' | 'left' | 'right' = playerDirection;

    switch (key) {
      case 'ArrowUp':
        newY = playerPos.y - 1;
        direction = 'up';
        break;
      case 'ArrowDown':
        newY = playerPos.y + 1;
        direction = 'down';
        break;
      case 'ArrowLeft':
        newX = playerPos.x - 1;
        direction = 'left';
        break;
      case 'ArrowRight':
        newX = playerPos.x + 1;
        direction = 'right';
        break;
      default:
        return;
    }

    // Check if the new position is valid (not grass and within bounds)
    if (
      newY >= 0 && newY < FARM_MAZE.length &&
      newX >= 0 && newX < FARM_MAZE[0].length &&
      FARM_MAZE[newY][newX] !== 0
    ) {
      setPlayerPos({ x: newX, y: newY });
      setPlayerDirection(direction);
    } else {
      // Just update direction even if can't move
      setPlayerDirection(direction);
    }
  }, [playerPos, gameWon, playerDirection]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const renderFarmCell = (cellValue: number, x: number, y: number) => {
    let style: React.CSSProperties = {
      left: x * CELL_SIZE,
      top: y * CELL_SIZE,
      width: CELL_SIZE,
      height: CELL_SIZE,
    };
    
    let className = "absolute border-none ";
    
    switch (cellValue) {
      case 0: // Corn crops
        className += "bg-yellow-800"; // Match the dirt path color
        // Use the corn crop PNG image with 3D effect
        style.backgroundImage = `url('/corn-crop.png')`;
        style.backgroundSize = '90%'; // Larger size for better visibility
        style.backgroundRepeat = 'no-repeat';
        style.backgroundPosition = 'center bottom'; // Anchor to bottom for 3D ground effect
        style.boxShadow = 'inset 0 -2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'; // 3D depth
        style.transform = 'perspective(100px) rotateX(2deg)'; // Subtle 3D tilt
        style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'; // 3D shadow effect
        break;
      case 1: // Dirt path
        className += "bg-yellow-800";
        // Detailed dirt texture
        style.backgroundImage = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23a16207'/%3E%3Ccircle cx='5' cy='7' r='1' fill='%23854d0e'/%3E%3Ccircle cx='15' cy='12' r='1' fill='%23713f12'/%3E%3Ccircle cx='25' cy='18' r='1' fill='%23854d0e'/%3E%3Ccircle cx='8' cy='23' r='1' fill='%23713f12'/%3E%3Ccircle cx='20' cy='5' r='1' fill='%23854d0e'/%3E%3Ccircle cx='12' cy='28' r='1' fill='%23713f12'/%3E%3Crect x='3' y='15' width='2' height='1' fill='%23525252' rx='0.5'/%3E%3Crect x='18' y='8' width='1' height='2' fill='%23737373' rx='0.5'/%3E%3Crect x='28' y='25' width='2' height='1' fill='%23525252' rx='0.5'/%3E%3C/svg%3E")`;
        break;
      case 2: // Farm entrance (now normal dirt path)
        className += "bg-yellow-800";
        // Same dirt texture as regular paths
        style.backgroundImage = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23a16207'/%3E%3Ccircle cx='5' cy='7' r='1' fill='%23854d0e'/%3E%3Ccircle cx='15' cy='12' r='1' fill='%23713f12'/%3E%3Ccircle cx='25' cy='18' r='1' fill='%23854d0e'/%3E%3Ccircle cx='8' cy='23' r='1' fill='%23713f12'/%3E%3Ccircle cx='20' cy='5' r='1' fill='%23854d0e'/%3E%3Ccircle cx='12' cy='28' r='1' fill='%23713f12'/%3E%3Crect x='3' y='15' width='2' height='1' fill='%23525252' rx='0.5'/%3E%3Crect x='18' y='8' width='1' height='2' fill='%23737373' rx='0.5'/%3E%3Crect x='28' y='25' width='2' height='1' fill='%23525252' rx='0.5'/%3E%3C/svg%3E")`;
        break;
      case 3: // Farm exit (now normal dirt path)
        className += "bg-yellow-800";
        // Same dirt texture as regular paths
        style.backgroundImage = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23a16207'/%3E%3Ccircle cx='5' cy='7' r='1' fill='%23854d0e'/%3E%3Ccircle cx='15' cy='12' r='1' fill='%23713f12'/%3E%3Ccircle cx='25' cy='18' r='1' fill='%23854d0e'/%3E%3Ccircle cx='8' cy='23' r='1' fill='%23713f12'/%3E%3Ccircle cx='20' cy='5' r='1' fill='%23854d0e'/%3E%3Ccircle cx='12' cy='28' r='1' fill='%23713f12'/%3E%3Crect x='3' y='15' width='2' height='1' fill='%23525252' rx='0.5'/%3E%3Crect x='18' y='8' width='1' height='2' fill='%23737373' rx='0.5'/%3E%3Crect x='28' y='25' width='2' height='1' fill='%23525252' rx='0.5'/%3E%3C/svg%3E")`;
        break;
    }

    return (
      <div
        key={`${x}-${y}`}
        className={className}
        style={{
          ...style,
          imageRendering: 'pixelated',
        }}
      />
    );
  };

  // Don't render anything if mobile (seamless)
  if (typeof window !== 'undefined') {
    const userAgent = navigator.userAgent;
    const isMobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isMobileScreen = window.innerWidth <= 768 && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    if (isMobileUA || isMobileScreen) {
      return null; // Completely seamless - no flash
    }
  }

  return (
    <div className="min-h-screen bg-green-200 flex flex-col items-center p-5 relative" style={{
      backgroundImage: `url('/background.png')`,
      backgroundSize: 'auto',
      backgroundRepeat: 'repeat'
    }}>
      
      {/* Background Audio */}
      <audio ref={audioRef} loop>
        <source src="/LandingPageAudio.mpeg" type="audio/mpeg" />
      </audio>

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-4 right-4 z-50 bg-black/50 backdrop-blur-sm text-white rounded-full p-3 hover:bg-black/70 transition-all duration-200 transform hover:scale-110"
      >
        {isPlaying ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
      </button>
      
      {/* Instructions */}
      <div className="text-center mb-6 text-white px-4 py-2">
        <p className="font-semibold text-3xl">Help Me Reach the Farm</p>
      </div>

      {/* Farm Container */}
      <div className="relative border-4 border-amber-800 bg-green-100 shadow-2xl rounded-lg">
        <div
          className="relative"
          style={{
            width: FARM_MAZE[0].length * CELL_SIZE,
            height: FARM_MAZE.length * CELL_SIZE,
          }}
        >
          {/* Render farm */}
          {FARM_MAZE.map((row, y) =>
            row.map((cell, x) => renderFarmCell(cell, x, y))
          )}
          
          {/* Entry Arrow - pointing into the maze */}
          <div
            className="absolute z-20 flex items-center justify-center text-green-600"
            style={{
              left: -40,
              top: 1 * CELL_SIZE + (CELL_SIZE / 2) - 15,
              width: 30,
              height: 30,
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            ➡️
          </div>
          
          {/* Exit Arrow - pointing out of the maze */}
          <div
            className="absolute z-20 flex items-center justify-center text-red-600"
            style={{
              left: FARM_MAZE[0].length * CELL_SIZE + 10,
              top: 1 * CELL_SIZE + (CELL_SIZE / 2) - 15,
              width: 30,
              height: 30,
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            ➡️
          </div>
          
          {/* Player Character - Animated Sprite */}
          <div
            className="absolute z-10 transition-all duration-150 ease-in-out"
            style={{
              left: playerPos.x * CELL_SIZE + 2,
              top: playerPos.y * CELL_SIZE + 2,
              width: CELL_SIZE - 4,
              height: CELL_SIZE - 4,
              backgroundImage: `url('/rpg_sprite_walk.png')`,
              backgroundSize: '800% 400%', // 8 columns x 4 rows sprite sheet
              backgroundRepeat: 'no-repeat',
              backgroundPosition: (() => {
                // Use static down-facing sprite (no animation)
                let x = 0; // Always use first frame
                let y = 0; // Always use row 0 (down-facing sprite)
                
                return `${x}% ${y}%`;
              })(),
              imageRendering: 'pixelated',
              borderRadius: '2px',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
            }}
          />
        </div>
      </div>

      {/* Thank You Message */}
      {showThankYou && (
        <div
          className="fixed inset-0 bg-gray-500 z-40 transition-opacity duration-1000 ease-in-out flex items-center justify-center"
          style={{
            opacity: showThankYou ? 0.8 : 0,
          }}
        >
          <div className="text-white text-4xl font-bold animate-pulse">
            ThankYou!
          </div>
        </div>
      )}

      {/* Original Fog/Smoke Transition Effect */}
      {showFog && (
        <div
          className="fixed inset-0 bg-gray-500 z-40 transition-opacity duration-2000 ease-in-out"
          style={{
            opacity: showFog ? 0.8 : 0,
            background: 'radial-gradient(circle, rgba(128,128,128,0.9) 0%, rgba(64,64,64,0.7) 50%, rgba(32,32,32,0.9) 100%)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 0.8; }
        }
        
        .pixelated {
          image-rendering: -moz-crisp-edges;
          image-rendering: -webkit-crisp-edges;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
}




