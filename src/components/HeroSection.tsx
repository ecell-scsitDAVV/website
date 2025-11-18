
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TextPressure from './TextPressure';
import LightRays from './LightRays';

const HeroSection: React.FC = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["Innovate", "Create", "Inspire", "Lead"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.08,
      },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 pt-20 pb-28 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-3"
        >
          <span className="inline-block py-1 px-3 mb-4 text-xs tracking-wider uppercase rounded-full bg-secondary text-primary font-medium">Entrepreneurship Cell</span>
        </motion.div>

        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <span className="text-white text-xl md:text-2xl lg:text-3xl font-medium tracking-wide">
              Empowering Students To
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ position: 'relative', height: '200px' }}
          >
            <TextPressure
              text="INNOVATE"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#ff0000"
              minFontSize={48}
              className="font-bold"
            />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8"
        >
          Building a community of student entrepreneurs, innovators and leaders through various initiatives, events and opportunities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#about"
            className="cursor-target px-8 py-3 bg-primary text-primary-foreground font-medium rounded-md transition-all duration-200 hover:shadow-lg hover:transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Learn More
          </a>
          <a
            href="#initiatives"
            className="cursor-target px-8 py-3 bg-secondary text-secondary-foreground font-medium rounded-md transition-all duration-200 hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Our Initiatives
          </a>
        </motion.div>
      </div>

      {/* Scroll Down Animation - Changed from fixed to absolute positioning */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none"
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2 text-gray-200 opacity-80 backdrop-blur-sm px-3 py-1 rounded-full">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center backdrop-blur-sm"
          >
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-3 bg-gray-300 rounded-full mt-2"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
