import React, { useEffect, useState } from "react";
import RevealAnimation from "./RevealAnimation";
import ImageWithFallback from "./ImageWithFallback";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const AUTO_SLIDE_INTERVAL = 3500;
const ANIMATION_STAGGER = 120;

const InitiativeCard = ({ title, description, imageSrc, delay }: any) => {
  return (
    <RevealAnimation delay={delay}>
      <div
        className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg 
                   hover:shadow-2xl transition-all duration-300 border border-white/20 
                   flex flex-col h-96"
      >
        {/* Image */}
        <div className="h-56 overflow-hidden">
          <ImageWithFallback
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold mb-2 text-blue-300">{title}</h3>
          <p className="text-gray-200 text-sm flex-grow">{description}</p>
        </div>
      </div>
    </RevealAnimation>
  );
};

const InitiativesSection: React.FC = () => {
  const initiatives = [
    {
      title: "E-Summit",
      description: "Flagship event bringing founders, investors & innovators together.",
      imageSrc: "https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=1170&q=80",
    },
    {
      title: "Startup Incubation",
      description: "Support early-stage startups with mentorship, resources & funding.",
      imageSrc: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1170&q=80",
    },
    {
      title: "Workshop Series",
      description: "Skill-based workshops covering entrepreneurship, business & tech.",
      imageSrc: "https://images.unsplash.com/photo-1544531585-9847b68c8c86?auto=format&fit=crop&w=1170&q=80",
    },
    {
      title: "Pitch Competition",
      description: "Present business ideas to judges & win mentorship opportunities.",
      imageSrc: "https://images.unsplash.com/photo-1533750516278-4555388a4a06?auto=format&fit=crop&w=1170&q=80",
    },
    {
      title: "Mentorship Program",
      description: "Connect with industry mentors & experienced founders.",
      imageSrc: "https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&w=1170&q=80",
    },
    {
      title: "Innovation Lab",
      description: "A creative space for building projects & collaborating.",
      imageSrc: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1170&q=80",
    },
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % initiatives.length);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="initiatives" className="py-24 px-4 tech-gradient">
      <div className="max-w-7xl mx-auto">

        {/* Tag */}
        <RevealAnimation>
          <span className="inline-block py-1 px-3 mb-3 text-xs tracking-wider uppercase 
            rounded-full bg-secondary text-primary font-medium">
            Our Initiatives
          </span>
        </RevealAnimation>

        {/* Heading */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10">
          <RevealAnimation delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Programs & Activities
            </h2>
          </RevealAnimation>

          <RevealAnimation delay={200}>
            <p className="text-gray-300 max-w-md mt-4 md:mt-0">
              Discover programs crafted to empower innovative thinkers and aspiring entrepreneurs.
            </p>
          </RevealAnimation>
        </div>

        {/* CAROUSEL (like Testimonials) */}
        <div className="mx-auto relative">
          <Carousel
            opts={{
              loop: true,
              align: "start",
            }}
            className="w-full"
            setApi={(api) => api && api.scrollTo(current)}
          >
            <CarouselContent>
              {initiatives.map((item, i) => (
                <CarouselItem
                  key={i}
                  className="basis-full sm:basis-1/2 lg:basis-1/3 px-3"
                >
                  <InitiativeCard
                    title={item.title}
                    description={item.description}
                    imageSrc={item.imageSrc}
                    delay={i * ANIMATION_STAGGER}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="-left-10 top-1/2" />
            <CarouselNext className="-right-10 top-1/2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default InitiativesSection;
