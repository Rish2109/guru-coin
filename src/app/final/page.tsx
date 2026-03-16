'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';

export default function FinalPage() {
    const [showFog, setShowFog] = useState(true);
    const [showText, setShowText] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const router = useRouter();
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

    const handleBackClick = () => {
        router.back(); // Go to previous page
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
        <div className="relative w-full min-h-screen md:h-screen md:overflow-hidden overflow-y-auto">
            {/* Background Audio */}
            <audio ref={audioRef} loop>
                <source src="/LastPageAudio.mpeg" type="audio/mpeg" />
            </audio>

            {/* Back Button */}
            <button
                onClick={handleBackClick}
                className="fixed bottom-4 left-4 z-50 bg-black/50 backdrop-blur-sm text-white rounded-full p-3 hover:bg-black/70 transition-all duration-200 transform hover:scale-110"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>

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
            <div className="relative md:absolute md:inset-0 flex items-center justify-center z-40 px-4 md:px-8 py-8 md:py-0 min-h-screen overflow-y-auto md:overflow-y-visible">
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
                    
                    <div className="mx-auto flex justify-center">
                        <div className="group relative inline-flex overflow-hidden rounded-3xl border-4 border-primary bg-black/20 shadow-2xl shadow-black/40 transition-all duration-300 hover:scale-[1.02] hover:border-primary/70 hover:bg-black/30 hover:shadow-primary/25">
                            <Image
                                src="/progress.jpg"
                                alt="Project progress"
                                width={1200}
                                height={900}
                                priority
                                className="block max-h-[52vh] w-auto max-w-full object-contain"
                            />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-5 opacity-0 transition-all duration-300 group-hover:opacity-100 md:pb-7">
                                <span className="text-lg font-bold tracking-[0.2em] text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)] md:text-2xl">
                                    GAME MAP OTW
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-white/15 bg-black/35 px-5 py-4 text-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:border-white/30 hover:bg-black/45 hover:shadow-xl hover:shadow-black/30 md:mt-8 md:px-8 md:py-5">
                        <p className="text-sm leading-relaxed text-white/90 md:text-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.75)' }}>
                            The dev team is deep in the workshop, shaping the game map, refining the details, and getting everything ready for the drop. The full map reveal is coming very soon, so stay tuned. More updates are on the way, and things are only getting better from here.
                        </p>
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