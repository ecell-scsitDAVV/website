
import React, { useState, useEffect } from 'react';

interface PlaceholderImageProps {
  src: string;
  alt: string;
  className?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  src,
  alt,
  className = '',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageLoaded(true);
    };
  }, [src]);

  return (
    <div className="relative overflow-hidden">
      <div
        className={`transition-opacity duration-500 ease-in-out ${
          imageLoaded ? 'opacity-0' : 'opacity-100'
        } absolute inset-0 bg-gray-200 animate-pulse`}
      />
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-500 ease-in-out ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  );
};

export default PlaceholderImage;
