
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black"
    >
      <div className="flex flex-col items-center">
        <motion.img
          src="/lovable-uploads/499b3589-d0d9-48f7-80dd-6ce910174b88.png"
          alt="E-Cell Logo"
          className="w-32 h-32 mb-4"
          animate={{ scale: [0.9, 1.1, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="h-1 bg-primary rounded-full mt-4"
          initial={{ width: 0 }}
          animate={{ width: "200px" }}
          transition={{ duration: 2, repeat: 1, repeatType: "reverse" }}
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
