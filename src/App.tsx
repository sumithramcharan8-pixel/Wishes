/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { Gift, Heart, Stars, MapPin, Calendar, Clock, ChevronDown, Camera, Sparkles, X } from "lucide-react";
import confetti from "canvas-confetti";

// --- Components ---

const SurpriseReveal = ({ triggerConfetti }: { triggerConfetti: (options: any) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
 
  const handleSurprise = () => {
    setIsOpen(true);
    
    // Slight delay to ensure DOM is ready
    setTimeout(() => {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };
 
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
 
      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
 
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
 
        const particleCount = 50 * (timeLeft / duration);
        
        try {
          triggerConfetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          triggerConfetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        } catch (e) {
          console.warn("Confetti error:", e);
        }
      }, 250);
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center pt-20">
      <motion.button
        onClick={handleSurprise}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex flex-col items-center gap-4 bg-white/40 backdrop-blur-xl p-10 rounded-[3rem] border border-amber-200/50 card-shadow cursor-pointer overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-100/20 to-amber-100/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 w-20 h-20 bg-warm-blush/30 rounded-full flex items-center justify-center animate-bounce">
          <Gift className="text-amber-700" size={32} />
        </div>
        <div className="relative z-10 text-center">
          <span className="serif text-2xl mb-1 block">A Gift for You</span>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Tap to Open</span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-warm-bg/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative max-w-2xl w-full bg-white p-8 md:p-14 rounded-[3rem] shadow-2xl border border-amber-100"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 p-2 hover:bg-amber-50 rounded-full transition-colors opacity-40"
              >
                <X size={24} />
              </button>

              <div className="text-center space-y-8">
                <div className="inline-block p-4 bg-rose-50 rounded-full">
                  <Heart className="text-rose-400 fill-rose-400" size={32} />
                </div>
                
                <h3 className="serif text-4xl md:text-5xl">Dearest Amma,</h3>
                
                <div className="serif text-lg md:text-xl text-amber-900/80 leading-relaxed italic space-y-6">
                  <p>
                    "Thank you for being the heart of my world. For every silent sacrifice, 
                    every whispered prayer, and every ounce of love you've poured into me."
                  </p>
                  <p>
                    "You aren't just my mother; you are my greatest inspiration and my safe harbor. 
                    May this year reward you with as much joy as you've given me since the day I was born."
                  </p>
                </div>

                <div className="pt-8">
                  <p className="serif text-2xl italic text-amber-700">- With endless love, Your Son</p>
                </div>

                <div className="flex justify-center gap-2 pt-4">
                   <Sparkles className="text-amber-300" size={16} />
                   <Sparkles className="text-amber-300" size={16} />
                   <Sparkles className="text-amber-300" size={16} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FlowerFall = () => {
  const [flowers, setFlowers] = useState<{ id: number; x: number; delay: number; duration: number; size: number; rotate: number; emoji: string }[]>([]);

  useEffect(() => {
    const emojis = ["🌸", "✨", "🎈"];
    const newFlowers = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 12 + Math.random() * 8,
      size: 16 + Math.random() * 24,
      rotate: Math.random() * 360,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setFlowers(newFlowers);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {flowers.map((flower) => (
        <motion.div
          key={flower.id}
          initial={{ y: -50, opacity: 0, rotate: flower.rotate }}
          animate={{
            y: "110vh",
            opacity: [0, 0.4, 0.4, 0],
            rotate: flower.rotate + 360,
          }}
          transition={{
            duration: flower.duration,
            repeat: Infinity,
            delay: flower.delay,
            ease: "linear",
          }}
          style={{
            left: `${flower.x}%`,
            fontSize: flower.size,
          }}
          className="absolute flex items-center justify-center grayscale-[0.5]"
        >
          {flower.emoji}
        </motion.div>
      ))}
    </div>
  );
};

const Countdown = ({ targetDate, onComplete }: { targetDate: Date; onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = targetDate.getTime() - new Date().getTime();
      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onComplete();
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return (
    <div className="flex gap-4 md:gap-12 items-center justify-center text-warm-ink">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Mins", value: timeLeft.minutes },
        { label: "Secs", value: timeLeft.seconds },
      ].map((item, i) => (
        <div key={item.label} className="flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.5 }}
            className="flex flex-col items-center"
          >
            <span className="serif text-6xl md:text-8xl font-light tabular-nums leading-none tracking-tight">{String(item.value).padStart(2, "0")}</span>
            <span className="text-[10px] uppercase tracking-widest mt-3 font-bold opacity-60">{item.label}</span>
          </motion.div>
          {i < 3 && (
            <span className="text-4xl px-2 md:px-6 opacity-20 serif font-light pb-8">:</span>
          )}
        </div>
      ))}
    </div>
  );
};

const WishCard = ({ title, content, emoji, index }: { title: string; content: string; emoji: string; index: number; key?: string | number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center"
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? 5 : -5 }}
        whileTap={{ scale: 0.9 }}
        className={`w-28 h-28 md:w-32 md:h-32 rounded-full bubble-btn text-4xl cursor-pointer ${isOpen ? 'ring-4 ring-warm-blush' : ''}`}
      >
        {emoji}
      </motion.button>
      
      <motion.div
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 10 }}
        className={`mt-6 text-center transform transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}
      >
        <h4 className="serif text-xl mb-2">{title}</h4>
        <p className="text-sm italic text-amber-900/70 max-w-[200px] leading-relaxed">
          "{content}"
        </p>
      </motion.div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [isFinished, setIsFinished] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setHours(24, 0, 0, 0); // Sets to 12 AM (midnight) of the next day
    return date;
  });

  const triggerConfetti = (options: any) => {
    if (confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true
      });
      myConfetti(options);
    } else {
      // Fallback
      confetti(options);
    }
  };

  const handleCountdownFinish = () => {
    setIsFinished(true);
    setTimeout(() => {
      try {
        triggerConfetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f2d1c9', '#e6b17e', '#5a5a40'],
          zIndex: 1000
        });
      } catch (e) {
        console.warn("Confetti error:", e);
      }
    }, 500);
  };

  const wishes = [
    { title: "Mother's Warmth", content: "May every day bring you the same warmth you've given all these years. You are my sunshine.", emoji: "☕" },
    { title: "Infinite Grace", content: "To the strongest woman I know, may your light never dim. Your grace is my inspiration.", emoji: "✨" },
    { title: "Household Joy", content: "Your smile makes the house a home. May this year be overflowing with reasons for you to laugh.", emoji: "🌸" },
    { title: "Serenity", content: "Wishing you a world of peace. You've cared for everyone, now it's time to care for you.", emoji: "🌿" },
    { title: "Eternal Health", content: "To many more years of grace, health, and being my beautiful guide through life.", emoji: "🍎" },
    { title: "Purest Love", content: "You are the heartbeat of my life. I love you more than words could ever possibly express.", emoji: "❤️" },
  ];

  return (
    <div className="relative min-h-screen selection:bg-warm-blush selection:text-amber-900 overflow-x-hidden">
      {/* Confetti Canvas */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[2000]"
      />

      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute top-1/4 -left-20 w-[40vw] h-[40vw] bg-rose-200 rounded-full blur-[120px]" />
        <div className="absolute top-[-10vw] right-[-10vw] w-[50vw] h-[50vw] bg-amber-100 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20vw] left-1/3 w-[60vw] h-[60vw] bg-pink-100 rounded-full blur-[180px]" />
      </div>

      <FlowerFall />

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold text-amber-700/60 mb-8"
          >
            {isFinished ? "It's Time to Celebrate!" : "The Countdown Begins"}
          </motion.div>

          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div
                key="countdown"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="serif text-5xl md:text-7xl mb-12"
                >
                  Waiting for <span className="italic">Amma</span>
                </motion.h1>
                <Countdown targetDate={targetDate} onComplete={handleCountdownFinish} />
              </motion.div>
            ) : (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="space-y-6"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="serif text-7xl md:text-9xl mb-4 leading-none"
                >
                  HAPPY <br />
                  <span className="italic text-rose-300">BIRTHDAY</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="serif text-2xl md:text-4xl text-amber-900/60"
                >
                  I Love You, <span className="italic">Amma!</span> 🌸
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="mt-8 p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-rose-200/50 max-w-md mx-auto"
                >
                  <p className="serif text-lg italic text-amber-900/80">
                    "{wishes[Math.floor(Math.random() * wishes.length)].content}"
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Scroll to Explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-amber-700/40 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Main Experience - Revealed after countdown */}
      <AnimatePresence>
        {isFinished && (
          <motion.main 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            className="relative z-10 max-w-6xl mx-auto px-6 pb-40"
          >
            {/* Wishes Section */}
            <section className="py-24 md:py-40">
              <div className="grid lg:grid-cols-[1fr,2fr] gap-20 items-start">
                <div className="space-y-6 lg:sticky lg:top-40">
                  <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-warm-accent">Dedication</span>
                  <h2 className="serif text-5xl md:text-6xl leading-tight">To <br /><span className="italic">Amma</span> ✨</h2>
                  <p className="text-amber-800/60 max-w-sm leading-relaxed">
                    To the woman who gives everything. Every bubble holds a heartfelt wish for you.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-8">
                  {wishes.map((wish, i) => (
                    <WishCard key={wish.title} {...wish} index={i} />
                  ))}
                </div>
              </div>
            </section>

            {/* Final Message Section */}
            <section className="py-24 md:py-40">
              <div className="max-w-3xl mx-auto text-center space-y-12">
                <div className="space-y-6">
                  <h3 className="serif text-5xl md:text-7xl leading-tight">
                    Happy Birthday <br />
                    <span className="italic">Amma</span>
                  </h3>
                  <div className="space-y-6 text-lg md:text-xl leading-relaxed text-amber-900/70 serif">
                    <p>
                      To the queen of my heart. You've spent a lifetime weaving love into the fabric of my life. 
                      Today, I celebrate the incredible woman you are—the foundation of my strength and the sunshine in my days.
                    </p>
                    <p>
                      Thank you for being my everything. May your path be paved with peace and your heart always find its way back to joy. 👑❤️
                    </p>
                  </div>
                </div>

                <div className="pt-12 border-t border-amber-200/30 flex justify-center items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl">🎈</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">2026 Portal</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-rose-200" />
                    ))}
                  </div>
                </div>

                <SurpriseReveal triggerConfetti={triggerConfetti} />
              </div>
            </section>
          </motion.main>
        )}
      </AnimatePresence>

      <footer className="relative z-10 border-t border-amber-200/30 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Made with Love</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
            Celebrating Life's Greatest Chapters
          </div>
        </div>
      </footer>
    </div>
  );
}
