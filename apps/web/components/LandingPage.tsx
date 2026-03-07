'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white selection:bg-black selection:text-white font-sans">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{ backgroundImage: 'url("/bg-img.png")' }}
      />

      {/* 1. Floating Pill Navbar */}
      <header className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
        <nav className="flex items-center gap-8 px-10 py-4 rounded-full bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl">
          {['Home', 'Services', 'Ride', 'Contact'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-light tracking-wide text-white/80 hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main Content Grid */}
      <main className="relative z-10 grid grid-cols-12 grid-rows-6 h-screen w-full p-8 md:p-12 lg:p-16">
        
        {/* 2. Central 'IMAGE' Area (Whitespace placeholder) */}
        <div className="col-start-3 col-end-11 row-start-2 row-end-5 rounded-[4rem] border-2 border-dashed border-black/5 flex items-center justify-center">
            {/* This area is intentionally empty/minimalist as per requirements */}
            <span className="text-black/5 font-black text-9xl tracking-tighter uppercase select-none">IMAGE</span>
        </div>

        {/* 3. 'MICRORITM' Button (Center-Right) */}
        <div className="col-start-10 col-end-13 row-start-3 flex items-center justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-black text-white rounded-full text-xs font-light tracking-[0.2em] shadow-xl hover:bg-zinc-900 transition-all border border-white/10"
          >
            MICRORITM
          </motion.button>
        </div>

        {/* 4. Left Side 'TEXT' Block (Bottom-Left) */}
        <div className="col-start-1 col-end-4 row-start-5 flex items-end">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full aspect-square max-w-[180px] bg-black rounded-3xl p-6 flex items-center justify-center shadow-2xl group border border-white/5"
          >
            <p className="text-[10px] font-medium tracking-[0.15em] text-white/40 group-hover:text-white transition-colors uppercase text-center leading-relaxed">
              Text Block 1
            </p>
          </motion.div>
        </div>

        {/* 5. Main 'TEXT' Block (Center-Right, Bottom) */}
        <div className="col-start-6 col-end-13 row-start-5 row-end-7 flex items-end">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full bg-black rounded-3xl p-12 flex flex-col justify-center shadow-2xl border border-white/5"
          >
            <h2 className="text-white text-3xl md:text-4xl font-light tracking-tight leading-snug">
              TEXT BLOCK 2 - <br/>
              <span className="font-bold">MAIN CONTENT AREA</span>
            </h2>
            <div className="mt-6 w-12 h-[1px] bg-white/20" />
            <p className="mt-6 text-white/50 font-light text-sm max-w-md tracking-wide">
              Replicating the exact visual hierarchy and structural balance of the provided technical reference.
            </p>
          </motion.div>
        </div>

      </main>

      {/* Global Aesthetics Injector (Inline CSS for specific needs) */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;700;900&display=swap');
        
        :root {
          --canvas-bg: #FFFFFF;
          --block-bg: #000000;
          --accent-blur: rgba(255, 255, 255, 0.7);
        }

        body {
          font-family: 'Inter', sans-serif;
          background-color: var(--canvas-bg);
          color: var(--block-bg);
          margin: 0;
          padding: 0;
        }

        .rounded-3xl {
          border-radius: 2rem;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
