'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Volume2, VolumeX } from 'lucide-react';

export default function FinalPage() {
    const [showFog, setShowFog] = useState(true);
    const [showText, setShowText] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const router = useRouter();
    const video1Ref = useRef<HTMLVideoElement>(null);
    const video2Ref = useRef<HTMLVideoElement>(null);
    const video3Ref = useRef<HTMLVideoElement>(null);
    const video4Ref = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // Start cloud transition immediately when page loads (no delay)
        const fogTimer = setTimeout(() => {
            setShowFog(false);
        }, 3000); // Cloud plays for 3 seconds then fades

        // Start text fade-in while cloud is still playing (overlap for seamless transition)
        const textTimer = setTimeout(() => {
            setShowText(true);
        }, 2000); // Text starts fading in during cloud animation

        return () => {
            clearTimeout(fogTimer);
            clearTimeout(textTimer);
        };
    }, []);

    // Handle 5-second video restart
    useEffect(() => {
        const setupVideoRestart = (videoRef: React.RefObject<HTMLVideoElement>) => {
            if (videoRef.current) {
                const video = videoRef.current;
                const handleTimeUpdate = () => {
                    if (video.currentTime >= 5) {
                        video.currentTime = 0;
                    }
                };
                video.addEventListener('timeupdate', handleTimeUpdate);
                return () => video.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };

        const cleanupFunctions: (() => void)[] = [];
        
        const cleanup1 = setupVideoRestart(video1Ref);
        const cleanup2 = setupVideoRestart(video2Ref);
        const cleanup3 = setupVideoRestart(video3Ref);
        const cleanup4 = setupVideoRestart(video4Ref);
        
        if (cleanup1) cleanupFunctions.push(cleanup1);
        if (cleanup2) cleanupFunctions.push(cleanup2);
        if (cleanup3) cleanupFunctions.push(cleanup3);
        if (cleanup4) cleanupFunctions.push(cleanup4);

        return () => {
            cleanupFunctions.forEach(cleanup => cleanup());
        };
    }, [showText]);

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

    return (
        <div className="relative w-full min-h-screen md:h-screen md:overflow-hidden">
            {/* Background Audio */}
            <audio ref={audioRef} loop>
                <source src="/LastPageAudio.mpeg" type="audio/mpeg" />
            </audio>

            {/* Mute/Unmute Button */}
            <button
                onClick={toggleMusic}
                className="fixed bottom-4 right-4 z-50 bg-black/50 backdrop-blur-sm text-white rounded-full p-3 hover:bg-black/70 transition-all duration-200 transform hover:scale-110"
            >
                {isPlaying ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>

            {/* Background Video */}
            <video 
                src="/LastPageVideo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Video Grid Overlay */}
            <div className="relative md:absolute md:inset-0 flex items-center justify-center z-40 px-4 md:px-8 py-8 md:py-0 min-h-screen">
                <div 
                    className="transition-all duration-[4000ms] ease-out max-w-6xl w-full"
                    style={{
                        opacity: showText ? 1 : 0,
                        transform: showText ? 'translateY(0)' : 'translateY(20px)'
                    }}
                >
                    {/* Title */}
                    <h1 className="text-3xl md:text-6xl font-bold text-white mb-6 md:mb-12 text-center font-headline" style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.8)' }}>
                        Behind the Scenes
                    </h1>
                    
                    {/* Video Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-7xl mx-auto">
                        {/* Video 1 */}
                        <div className="relative flex flex-col items-center group cursor-pointer">
                            <div className="relative bg-black/20 rounded-3xl overflow-hidden border-4 border-primary hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 w-full max-w-[280px] md:w-80 hover:scale-105 group-hover:bg-black/30">
                                <video 
                                    ref={video1Ref}
                                    className="w-full h-48 md:h-64 object-cover transition-all duration-300 group-hover:brightness-110 group-hover:contrast-110"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source src="/Progress1.mp4" type="video/mp4" />
                                    {/* Placeholder background */}
                                    <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                                        <span className="text-white text-lg">Video 1</span>
                                    </div>
                                </video>
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                    <div className="text-white text-sm font-semibold bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                                        Development Process
                                    </div>
                                </div>
                            </div>
                            <p className="text-white/90 text-sm md:text-lg mt-2 md:mt-3 text-center group-hover:text-white transition-colors duration-300 px-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                Created The Logics for Movements.
                            </p>
                        </div>

                        {/* Video 2 */}
                        <div className="relative flex flex-col items-center group cursor-pointer">
                            <div className="relative bg-black/20 rounded-3xl overflow-hidden border-4 border-primary hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 w-full max-w-[280px] md:w-80 hover:scale-105 group-hover:bg-black/30">
                                <video 
                                    ref={video2Ref}
                                    className="w-full h-48 md:h-64 object-cover transition-all duration-300 group-hover:brightness-110 group-hover:contrast-110"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source src="/Progress2.mp4" type="video/mp4" />
                                    {/* Placeholder background */}
                                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                                        <span className="text-white text-lg">Video 2</span>
                                    </div>
                                </video>
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                    <div className="text-white text-sm font-semibold bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                                        Animation Design
                                    </div>
                                </div>
                            </div>
                            <p className="text-white/90 text-sm md:text-lg mt-2 md:mt-3 text-center group-hover:text-white transition-colors duration-300 px-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                Added avatar with Animations for realistic movement.
                            </p>
                        </div>

                        {/* Video 3 */}
                        <div className="relative flex flex-col items-center group cursor-pointer">
                            <div className="relative bg-black/20 rounded-3xl overflow-hidden border-4 border-primary hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 w-full max-w-[280px] md:w-80 hover:scale-105 group-hover:bg-black/30">
                                <video 
                                    ref={video3Ref}
                                    className="w-full h-48 md:h-64 object-cover transition-all duration-300 group-hover:brightness-110 group-hover:contrast-110"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source src="/Progress3.mp4" type="video/mp4" />
                                    {/* Placeholder background */}
                                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                                        <span className="text-white text-lg">Video 3</span>
                                    </div>
                                </video>
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                    <div className="text-white text-sm font-semibold bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                                        Game Integration
                                    </div>
                                </div>
                            </div>
                            <p className="text-white/90 text-sm md:text-lg mt-2 md:mt-3 text-center group-hover:text-white transition-colors duration-300 px-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                Jumped into the game environment with the actual interactions.
                            </p>
                        </div>

                        {/* Video 4 */}
                        <div className="relative flex flex-col items-center group cursor-pointer">
                            <div className="relative bg-black/20 rounded-3xl overflow-hidden border-4 border-primary hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 w-full max-w-[280px] md:w-80 hover:scale-105 group-hover:bg-black/30">
                                <Image 
                                    src="/Progress4.jpeg"
                                    alt="Behind the scenes - Part 4"
                                    width={320}
                                    height={256}
                                    className="w-full h-48 md:h-64 object-cover transition-all duration-300 group-hover:brightness-110 group-hover:contrast-110 group-hover:scale-105"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                    <div className="text-white text-sm font-semibold bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                                        Behind the Scenes
                                    </div>
                                </div>
                            </div>
                            <p className="text-white/90 text-sm md:text-lg mt-2 md:mt-3 text-center group-hover:text-white transition-colors duration-300 px-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                We work on new ideas every day so that everyone can enjoy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Original Smoke/Fog Transition Effect */}
            <div 
                className="fixed inset-0 z-50 pointer-events-none transition-all duration-[3000ms] ease-out"
                style={{
                    opacity: showFog ? 0.9 : 0,
                    background: `
                        radial-gradient(circle at center, 
                            rgba(64, 64, 64, 0.8) 0%, 
                            rgba(96, 96, 96, 0.7) 30%,
                            rgba(128, 128, 128, 0.6) 50%,
                            rgba(160, 160, 160, 0.5) 70%,
                            rgba(192, 192, 192, 0.4) 100%
                        )
                    `,
                    backdropFilter: 'blur(8px)',
                    transform: showFog ? 'scale(1)' : 'scale(1.2)',
                }}
            >
                {/* Animated smoke particles */}
                <div 
                    className="absolute inset-0 transition-all duration-[3000ms] ease-out"
                    style={{
                        opacity: showFog ? 0.6 : 0,
                        background: `
                            repeating-conic-gradient(from 0deg at 25% 25%, 
                                transparent 0deg, 
                                rgba(255, 255, 255, 0.05) 30deg, 
                                transparent 60deg
                            ),
                            repeating-conic-gradient(from 45deg at 75% 75%, 
                                transparent 0deg, 
                                rgba(200, 200, 200, 0.03) 30deg, 
                                transparent 60deg
                            )
                        `,
                        backgroundSize: '200px 200px, 150px 150px',
                        animation: showFog ? 'smokeFloat 8s linear infinite' : 'none',
                        filter: 'blur(2px)',
                    }}
                />
            </div>
            
            {/* CSS for smoke animation */}
            <style jsx>{`
                @keyframes smokeFloat {
                    0% { 
                        transform: translate(0, 0) rotate(0deg);
                        opacity: 0.6;
                    }
                    25% { 
                        transform: translate(-10px, -5px) rotate(90deg);
                        opacity: 0.4;
                    }
                    50% { 
                        transform: translate(5px, -10px) rotate(180deg);
                        opacity: 0.3;
                    }
                    75% { 
                        transform: translate(10px, -5px) rotate(270deg);
                        opacity: 0.4;
                    }
                    100% { 
                        transform: translate(0, 0) rotate(360deg);
                        opacity: 0.6;
                    }
                }
            `}</style>
        </div>
    );
}