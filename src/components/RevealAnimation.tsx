
import React, { useEffect, useRef, useState } from 'react';

interface RevealAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const RevealAnimation: React.FC<RevealAnimationProps> = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
  direction = 'up',
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsRevealed(true);
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    const current = ref.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [delay, threshold]);

  const getDirectionClass = () => {
    if (!isRevealed) {
      switch(direction) {
        case 'up': return 'transform translate-y-[20px]';
        case 'down': return 'transform -translate-y-[20px]';
        case 'left': return 'transform translate-x-[20px]';
        case 'right': return 'transform -translate-x-[20px]';
        default: return 'transform translate-y-[20px]';
      }
    }
    return 'transform translate-y-0 translate-x-0';
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isRevealed ? 'opacity-100' : 'opacity-0'} ${getDirectionClass()} ${className}`}
    >
      {children}
    </div>
  );
};

export default RevealAnimation;
