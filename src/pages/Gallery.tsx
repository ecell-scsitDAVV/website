import React from 'react';
import Navbar from '@/components/Navbar';
import EventGallery from '@/components/EventGallery';
import { Helmet } from "react-helmet";

const Gallery = () => {
  return (
    <div className="tech-gradient relative overflow-hidden">
      <Helmet>
        <title>Gallery - E-Cell SCSIT, DAVV</title>
        <meta name="description" content="The Entrepreneurship Cell - SCSIT here is the official Entrepreneurship Cell of SCSIT, DAVV Indore. We foster innovation, startups, and tech-driven student initiatives." />
        <link rel="canonical" href="https://ecell-davv.vercel.app/" />
      </Helmet>
      <Navbar />
      <main className="pt-20">
        <EventGallery />
      </main>
    </div>
  );
};

export default Gallery;