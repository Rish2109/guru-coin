'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Menu, Cat, Twitter, Send, Volume2, VolumeX } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';


const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 4.75V14.5a3.5 3.5 0 1 1-3.5-3.5H16"/>
    </svg>
  );

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const NavLinks = ({ className, onLinkClick }: { className?: string; onLinkClick?: () => void }) => (
    <div className={className}>
        <Link href="#gallery" onClick={onLinkClick} className="text-lg font-medium text-white/80 hover:text-primary transition-colors">Gallery</Link>
        <Link href="#how-to-buy" onClick={onLinkClick} className="text-lg font-medium text-white/80 hover:text-primary transition-colors">How To Buy</Link>
        <Link href="#roadmap" onClick={onLinkClick} className="text-lg font-medium text-white/80 hover:text-primary transition-colors">Roadmap</Link>
        <Link href="#chart" onClick={onLinkClick} className="text-lg font-medium text-white/80 hover:text-primary transition-colors">Chart</Link>
        <Link href="#announcement" onClick={onLinkClick} className="text-lg font-medium text-white/80 hover:text-primary transition-colors">Announcements</Link>
    </div>
);


const memeImages = [
    "https://res.cloudinary.com/ds0ifdrhk/image/upload/v1762643837/WhatsApp_Image_2025-11-09_at_12.45.09_AM_bcjimr.jpg",
    "https://res.cloudinary.com/ds0ifdrhk/image/upload/v1762643837/WhatsApp_Image_2025-11-09_at_12.45.09_AM_2_uf9ygg.jpg",
    "https://res.cloudinary.com/ds0ifdrhk/image/upload/v1762643837/WhatsApp_Image_2025-11-09_at_12.45.09_AM_1_amhfcn.jpg",
    "https://res.cloudinary.com/ds0ifdrhk/image/upload/v1762643836/WhatsApp_Image_2025-11-09_at_12.57.55_AM_1_ge2etj.jpg",
    "https://res.cloudinary.com/ds0ifdrhk/image/upload/v1762643837/WhatsApp_Image_2025-11-09_at_12.57.55_AM_n5gjes.jpg",
    "https://res.cloudinary.com/ds0ifdrhk/image/upload/v1762643837/WhatsApp_Image_2025-11-09_at_12.45.31_AM_pvb8tl.jpg",
];

const tokenomicsData = [
  { name: 'Pump.fun Tokens', value: 77, description: 'Available during the fair launch.' },
  { name: 'Burned', value: 7, description: 'Tokens removed from circulation forever.' },
  { name: 'Humane Society / Cat Shelters', value: 5, description: 'Donations to help our furry friends.' },
  { name: 'Dev Team', value: 4, description: 'Vested to ensure long-term commitment.' },
  { name: 'Marketing', value: 3, description: 'To spread the word of Pumpkin.' },
  { name: 'Airdrops', value: 2, description: 'Rewards for the community.' },
  { name: 'Pumpkin the Cat', value: 1, description: 'For food, treats, and litter.' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function HomePage() {
    const contractAddress = "------COMING SOON------";
    const [copied, setCopied] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showAudioDialog, setShowAudioDialog] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showContractAddress, setShowContractAddress] = useState(false);
    const [isAnnouncementPlaying, setIsAnnouncementPlaying] = useState(false);
    const [isAnnouncementHovered, setIsAnnouncementHovered] = useState(false);
    const [isAnnouncementMuted, setIsAnnouncementMuted] = useState(true);
    const [isAnnouncementInView, setIsAnnouncementInView] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const announcementVideoRef = useRef<HTMLVideoElement>(null);
    const announcementSectionRef = useRef<HTMLDivElement>(null);
    const caRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        // Show the dialog once on mount
        setShowAudioDialog(true);
    }, []);

    // Intersection Observer for announcement section
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (!isAnnouncementInView) {
                        setIsAnnouncementInView(true);
                        // Start video with 1 second delay on first view
                        setTimeout(() => {
                            if (announcementVideoRef.current) {
                                announcementVideoRef.current.play();
                                setIsAnnouncementPlaying(true);
                            }
                        }, 1000);
                    } else {
                        // Resume video if it was previously viewed
                        if (announcementVideoRef.current) {
                            announcementVideoRef.current.play();
                            setIsAnnouncementPlaying(true);
                        }
                    }
                } else {
                    // Pause video when out of view
                    if (announcementVideoRef.current) {
                        announcementVideoRef.current.pause();
                        setIsAnnouncementPlaying(false);
                    }
                }
            },
            {
                threshold: 0.3 // Trigger when 30% of the section is visible
            }
        );

        if (announcementSectionRef.current) {
            observer.observe(announcementSectionRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const handlePlayMusic = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const toggleMusic = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleAnnouncementVideo = () => {
        if (announcementVideoRef.current) {
            if (isAnnouncementPlaying) {
                announcementVideoRef.current.pause();
            } else {
                announcementVideoRef.current.play();
            }
            setIsAnnouncementPlaying(!isAnnouncementPlaying);
        }
    };

    const toggleAnnouncementMute = () => {
        if (announcementVideoRef.current) {
            if (isAnnouncementMuted) {
                // Unmuting announcement video - stop main audio if playing
                if (isPlaying && audioRef.current) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                }
                announcementVideoRef.current.muted = false;
                setIsAnnouncementMuted(false);
            } else {
                // Muting announcement video
                announcementVideoRef.current.muted = true;
                setIsAnnouncementMuted(true);
            }
        }
    };

    const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

    const handleShowContractAddress = () => {
        setShowContractAddress(true);
        // Scroll to CA section after a small delay to ensure it's rendered
        setTimeout(() => {
            caRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 50);
    };

    const copyContractAddress = async () => {
        const contractAddress = '3VWGMLE5VBTDVYFBNFIK4GZPSTMSCBR52HTBPZZPPUMP';
        try {
            await navigator.clipboard.writeText(contractAddress);
            toast({
                title: "Contract Address Copied to the ClipBoard",
                duration: 2000,
            });
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) { // Scrolling down
                setIsHeaderVisible(false);
            } else { // Scrolling up
                setIsHeaderVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <div className="flex flex-col min-h-screen text-foreground relative" style={{
            minHeight: '100vh',
            minHeight: '100dvh', // Dynamic viewport height for modern browsers
        }}>
            {/* Add custom styles for slide animation */}
            <style jsx>{`
                @keyframes slideInLeft {
                    from {
                        transform: translateX(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in-left {
                    animation: slideInLeft 0.8s ease-out;
                }
            `}</style>
            {/* Background Video */}
            <video 
                src="/BackgroundVid.mp4"
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                disablePictureInPicture={true}
                disableRemotePlayback={true}
                preload="auto"
                className="fixed top-0 left-0 w-screen h-screen object-cover z-0 pointer-events-none"
                style={{
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    userSelect: 'none',
                    minHeight: '100vh',
                    minWidth: '100vw',
                    position: 'fixed',
                    transform: 'translate3d(0, 0, 0)',
                    backfaceVisibility: 'hidden',
                }}
                onContextMenu={(e) => e.preventDefault()}
            />
            
            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col min-h-screen overflow-y-auto md:overflow-y-visible" style={{
                minHeight: '100vh',
                minHeight: '100dvh', // Dynamic viewport height for modern browsers
            }}>
             <audio ref={audioRef} loop>
                <source src="/HomePageAudio.mpeg" type="audio/mpeg" />
            </audio>

            <AlertDialog open={showAudioDialog} onOpenChange={setShowAudioDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Welcome to $GURU!</AlertDialogTitle>
                        <AlertDialogDescription>
                            Would you like to enable background music for the full experience?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Mute</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePlayMusic}>Play Music</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <Button
                variant="ghost"
                size="icon"
                className="fixed bottom-4 right-4 z-50 bg-black/50 backdrop-blur-sm"
                onClick={toggleMusic}
            >
                {isPlaying ? <Volume2 /> : <VolumeX />}
            </Button>


            <header className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="container mx-4 sm:mx-auto mt-4">
                    <nav className="flex items-center justify-between p-3 bg-black/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg">
                        <Link href="/home" className="flex items-center gap-2 text-2xl font-bold text-white font-headline">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={40}
                                height={40}
                                className="w-8 h-8"
                            />
                            $GURU
                        </Link>
                        <NavLinks className="hidden md:flex items-center gap-6" />
                        <div className="flex items-center gap-2">
                             <Button asChild className="hidden md:flex font-bold bg-gradient-to-r from-primary to-slate-400 text-primary-foreground hover:from-primary/90 hover:to-slate-400/90">
                                <Link href="https://pump.fun/" target="_blank" rel="noopener noreferrer">
                                    BUY ON PUMPFUN
                                </Link>
                            </Button>
                            <div className="md:hidden">
                                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Menu className="w-6 h-6" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="bg-black/80 border-l-white/10">
                                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                        <SheetDescription className="sr-only">Main navigation menu for mobile devices</SheetDescription>
                                        <NavLinks className="flex flex-col items-center justify-center h-full gap-8" onLinkClick={() => setMobileMenuOpen(false)} />
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-2 md:px-4 pt-32 md:pt-40">
                {/* Hero Section */}
                <section id="home" className="grid md:grid-cols-2 items-center justify-center py-8 md:py-12 gap-12 text-center md:text-left relative min-h-[100vh]">
                    {/* Button Images positioned at bottom of viewport - Desktop */}
                    <div className="hidden md:block">
                        <Image
                            src="/button1.png"
                            alt="Button 1"
                            width={200}
                            height={200}
                            className="absolute bottom-36 left-12 z-10 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => window.open('https://dexscreener.com/solana/4EGX5GjGsFtpKRRaSdQv1bwuAAybYh3AbmfRuuyZTPxP', '_blank')}
                        />
                        <Image
                            src="/button2.png"
                            alt="Button 2"
                            width={200}
                            height={200}
                            className="absolute bottom-32 left-80 z-10 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => window.open('https://x.com/gurucabbage', '_blank')}
                        />
                        <Image
                            src="/button3.png"
                            alt="Button 3"
                            width={200}
                            height={200}
                            className="absolute bottom-40 right-80 z-10 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => window.open('https://t.me/guru_buds_weed_farm', '_blank')}
                        />
                        <Image
                            src="/button4.png"
                            alt="Button 4"
                            width={200}
                            height={200}
                            className="absolute bottom-40 right-12 z-10 cursor-pointer hover:scale-105 transition-transform"
                            onClick={handleShowContractAddress}
                        />
                        <Image
                            src="/button5.png"
                            alt="Button 5"
                            width={350}
                            height={200}
                            className="absolute bottom-44 left-1/2 -translate-x-1/2 z-10 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => router.push('/final')}
                        />
                    </div>

                    {/* Mobile Button Layout - Responsive Grid */}
                    <div className="block md:hidden absolute bottom-32 left-4 right-4 z-10">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <Image
                                src="/button1.png"
                                alt="Button 1"
                                width={120}
                                height={120}
                                className="w-full max-w-[120px] h-auto mx-auto cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => window.open('https://dexscreener.com/solana/4EGX5GjGsFtpKRRaSdQv1bwuAAybYh3AbmfRuuyZTPxP', '_blank')}
                            />
                            <Image
                                src="/button2.png"
                                alt="Button 2"
                                width={120}
                                height={120}
                                className="w-full max-w-[120px] h-auto mx-auto cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => window.open('https://x.com/gurucabbage', '_blank')}
                            />
                            <Image
                                src="/button3.png"
                                alt="Button 3"
                                width={120}
                                height={120}
                                className="w-full max-w-[120px] h-auto mx-auto cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => window.open('https://t.me/guru_buds_weed_farm', '_blank')}
                            />
                            <Image
                                src="/button4.png"
                                alt="Button 4"
                                width={120}
                                height={120}
                                className="w-full max-w-[120px] h-auto mx-auto cursor-pointer hover:scale-105 transition-transform"
                                onClick={handleShowContractAddress}
                            />
                        </div>
                        <div className="flex justify-center">
                            <Image
                                src="/button5.png"
                                alt="Button 5"
                                width={200}
                                height={120}
                                className="max-w-[200px] h-auto cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => router.push('/final')}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-start gap-6 order-2 md:order-1">
                        {/* Content will be added here later */}
                    </div>
                    <div className="flex justify-center items-center order-1 md:order-2">
                    </div>
                </section>

                {/* Contract Address Image - Slides in from left */}
                {showContractAddress && (
                    <section ref={caRef} className="pt-1 max-w-3xl mx-auto animate-slide-in-left px-4">
                        <div className="flex justify-center">
                            <Image
                                src="/CA.png"
                                alt="Contract Address"
                                width={450}
                                height={110}
                                className="w-full max-w-[450px] h-auto rounded-lg shadow-lg object-contain cursor-pointer hover:scale-105 transition-transform"
                                onClick={copyContractAddress}
                            />
                        </div>
                    </section>
                )}
                
                {/* Gallery Section */}
                <section id="gallery" className="py-12 md:py-24 max-w-6xl mx-auto">
                    <div className="text-center mb-8 md:mb-16">
                        <h2 className="font-bold text-3xl md:text-6xl text-primary mb-4 font-headline" style={{ textShadow: '2px 2px 0 #000' }}>MEME GALLERY</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="group relative overflow-hidden rounded-xl border-4 border-primary/50 transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_10px_hsl(var(--primary)/0.3)] hover:scale-105 h-80">
                            <Image
                                src="/Meme1.jpeg"
                                alt="Meme 1"
                                width={400}
                                height={400}
                                className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-xl border-4 border-primary/50 transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_10px_hsl(var(--primary)/0.3)] hover:scale-105 h-80">
                            <Image
                                src="/Meme2.jpeg"
                                alt="Meme 2"
                                width={400}
                                height={400}
                                className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-xl border-4 border-primary/50 transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_10px_hsl(var(--primary)/0.3)] hover:scale-105 h-80">
                            <Image
                                src="/Meme3.jpeg"
                                alt="Meme 3"
                                width={400}
                                height={400}
                                className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-xl border-4 border-primary/50 transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_10px_hsl(var(--primary)/0.3)] hover:scale-105 h-80">
                            <Image
                                src="/Meme4.jpeg"
                                alt="Meme 4"
                                width={400}
                                height={400}
                                className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-xl border-4 border-primary/50 transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_10px_hsl(var(--primary)/0.3)] hover:scale-105 h-80">
                            <Image
                                src="/Meme5.jpeg"
                                alt="Meme 5"
                                width={400}
                                height={400}
                                className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-xl border-4 border-primary/50 transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_10px_hsl(var(--primary)/0.3)] hover:scale-105 h-80">
                            <Image
                                src="/Meme6.jpeg"
                                alt="Meme 6"
                                width={400}
                                height={400}
                                className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                        </div>
                    </div>
                </section>
                
                {/* How to Buy Section */}
                <section id="how-to-buy" className="py-24 pt-40 max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-bold text-6xl text-primary mb-4 font-headline" style={{ textShadow: '2px 2px 0 #000' }}>HOW DO I BUY $GURU COIN</h2>
                        <p className="text-xl text-white/80">GET STARTED WITH $GURU COIN IN THREE SIMPLE STEPS</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {/* Step 1 */}
                        <div className="bg-black/60 backdrop-blur-sm border border-primary/30 rounded-xl p-8 text-center transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-[0_0_30px_10px_hsl(var(--primary)/0.2)] hover:bg-black/70 cursor-pointer group">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-primary/40 group-hover:scale-110">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-4">1. CREATE A WALLET</h3>
                            <p className="text-white/80 leading-relaxed">
                                Download a crypto wallet like MetaMask or Trust Wallet. Keep your seed phrase safer than a high score on Pac-Man.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-black/60 backdrop-blur-sm border border-primary/30 rounded-xl p-8 text-center transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-[0_0_30px_10px_hsl(var(--primary)/0.2)] hover:bg-black/70 cursor-pointer group">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-primary/40 group-hover:scale-110">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-4">2. GET SOME SOL</h3>
                            <p className="text-white/80 leading-relaxed">
                                You'll need some SOL in your wallet to swap for $GURU Coin. Get it from a centralized exchange or a friend who owes you one.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-black/60 backdrop-blur-sm border border-primary/30 rounded-xl p-8 text-center transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-[0_0_30px_10px_hsl(var(--primary)/0.2)] hover:bg-black/70 cursor-pointer group">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-primary/40 group-hover:scale-110">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-4">3. SWAP FOR $GURU COIN</h3>
                            <p className="text-white/80 leading-relaxed">
                                Go to PumpFun, paste the $GURU Coin contract address, and swap your SOL. Welcome to the farm.
                            </p>
                        </div>
                    </div>

                    {/* Buy Button */}
                    <div className="text-center">
                        <Button asChild size="lg" className="text-xl px-12 py-6 bg-gradient-to-r from-primary to-slate-400 text-primary-foreground hover:from-primary/90 hover:to-slate-400/90 font-bold">
                            <Link href="https://pump.fun/" target="_blank" rel="noopener noreferrer">
                                BUY $GURU NOW
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* Roadmap Section */}
                <section id="roadmap" className="py-24 w-full">
                    <h2 className="font-bold text-5xl text-primary mb-12 text-center font-headline" style={{ textShadow: '2px 2px 0 #000' }}>ROADMAP</h2>
                    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
                        <Card className="bg-card/50 border-primary/50 text-center transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-[0_0_30px_10px_hsl(var(--primary)/0.2)] hover:bg-card/70 cursor-pointer group">
                            <CardHeader>
                                <CardTitle className="font-bold text-primary text-3xl font-headline transition-all duration-300 group-hover:text-primary group-hover:scale-105">Phase 1: The Launch</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-white/80">
                                <p>✅ GURU introduced as the new face of cozy P2E gaming</p>
                                <p>✅ Branding locked in artwork, memes, pixel aesthetic, full identity</p>
                                <p>✅ Website goes live with clean visuals + clear mission</p>
                                <p>✅ Verified X profile secured</p>
                                <p>✅ Telegram surges as followers pile in for the GURU takeover</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50 border-primary/50 text-center transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-[0_0_30px_10px_hsl(var(--primary)/0.2)] hover:bg-card/70 cursor-pointer group">
                            <CardHeader>
                                <CardTitle className="font-bold text-primary text-3xl font-headline transition-all duration-300 group-hover:text-primary group-hover:scale-105">Phase 2: The Growth</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-white/80">
                                <p>⚪️ Official token launch on Pump.fun</p>
                                <p>⚪️ Meme pushes, raid teams, and social exposure campaigns</p>
                                <p>⚪️ Enhanced token info updated on Dex / Dexscreener for polished presentation</p>
                                <p>⚪️ Listings on trackers + visibility integrations</p>
                                <p>⚪️ Collabs, partnerships, and expansion of the $GURU lore and character universe</p>
                                <p>⚪️ Strategic content drops + daily community engagement</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50 border-primary/50 text-center transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-[0_0_30px_10px_hsl(var(--primary)/0.2)] hover:bg-card/70 cursor-pointer group">
                            <CardHeader>
                                <CardTitle className="font-bold text-primary text-3xl font-headline transition-all duration-300 group-hover:text-primary group-hover:scale-105">Phase 3: The Takeover</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-white/80">
                                <p>⚪️ GURU becomes a recognizable symbol across Solana culture</p>
                                <p>⚪️ Coordinated raids, campaigns, and high-impact community initiatives</p>
                                <p>⚪️ Ecosystem utilities & integrations rolled out as the project scales</p>
                                <p>⚪️ Continued growth through partnerships, content, and community strength</p>
                                <p>⚪️ $GURU solidifies itself as a top-tier meme force with lasting momentum</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* DexScreener Section */}
                <section id="chart" className="py-24">
                    <h2 className="font-bold text-5xl text-primary mb-12 text-center font-headline" style={{ textShadow: '2px 2px 0 #000' }}>LIVE CHART</h2>
                    <div className="rounded-2xl overflow-hidden border-2 border-primary/50">
                        <iframe 
                            src="https://dexscreener.com/injective/0xd9089235d2c1b07261cbb2071f4f5a7f92fa1eca940e3cad88bb671c288a972f?embed=1&loadChartSettings=0&info=0&chartLeftToolbar=0&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15"
                            className="w-full h-[600px] md:h-[800px]"
                        ></iframe>
                    </div>
                </section>

                {/* Announcement Section */}
        <section id="announcement" className="py-24 text-center" ref={announcementSectionRef}>
          <h2 className="font-display text-5xl text-primary mb-6 font-headline">
            Announcement
          </h2>
          <div className="inline-block bg-card/50 border border-primary/30 rounded-lg px-4 py-2 mb-8">
            <p className="text-lg text-muted-foreground">
              Get a chance to be in our website every week 💪🔥
            </p>
          </div>
          <div 
            className="relative max-w-2xl mx-auto border-4 border-primary rounded-lg flex items-center justify-center bg-card/20 transition-all duration-300 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105"
            onMouseEnter={() => setIsAnnouncementHovered(true)}
            onMouseLeave={() => setIsAnnouncementHovered(false)}
          >
            <Image
              src="https://res.cloudinary.com/ds0ifdrhk/image/upload/v1760018061/360_F_204257104_jnqWGXAbNuyORkJG9yw9tdfutvkmJblt-removebg-preview_mwuqx8.png"
              alt="Crown"
              width={150}
              height={150}
              className="absolute -top-16 z-10"
              data-ai-hint="crown icon"
            />
            <video 
              ref={announcementVideoRef}
              src="/Announcement.MP4"
              loop
              muted
              playsInline
              className="w-full h-auto rounded-lg transition-all duration-300 hover:brightness-110" 
            />
            
            {/* Video Controls */}
            {isAnnouncementHovered && (
              <>
                {/* Play/Pause Button - Center */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <button
                    onClick={toggleAnnouncementVideo}
                    className="bg-black/60 hover:bg-black/80 text-white rounded-full p-4 transition-all duration-200 backdrop-blur-sm transform hover:scale-110"
                    style={{
                      opacity: isAnnouncementHovered ? 1 : 0,
                      transition: 'opacity 300ms ease-in-out, transform 200ms ease-in-out'
                    }}
                  >
                    {isAnnouncementPlaying ? (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Mute/Unmute Button - Bottom Right */}
                <div className="absolute bottom-4 right-4 z-20">
                  <button
                    onClick={toggleAnnouncementMute}
                    className="bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-sm transform hover:scale-110"
                    style={{
                      opacity: isAnnouncementHovered ? 1 : 0,
                      transition: 'opacity 300ms ease-in-out, transform 200ms ease-in-out'
                    }}
                  >
                    {isAnnouncementMuted ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
            </main>

            <footer className="w-full text-center py-8 mt-12 border-t border-primary/20 bg-black/50">
                <p className="text-white/70">&copy; {new Date().getFullYear()} $GURU. All rights reserved.</p>
                <p className="text-xs text-white/50 mt-2">This token is for entertainment purposes only and is not financial advice.</p>
            </footer>
            </div>
        </div>
    );
}