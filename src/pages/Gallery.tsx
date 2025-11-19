import React from 'react';
import Navbar from '@/components/Navbar';
import EventGallery from '@/components/EventGallery';

const Gallery = () => {
  return (
    <div className="tech-gradient relative overflow-hidden">
      <Navbar />
      <main className="pt-20">
        <EventGallery />
      </main>
    </div>
  );
};

export default Gallery;