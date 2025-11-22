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
import { supabase } from "@/integrations/supabase/client";

interface Initiative {
  id: string;
  title: string;
  description: string;
  images: string[]; // using first image only for display
}


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
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("initiatives")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) throw new Error(fetchError.message);

        setInitiatives(data || []);

        // Store backup in localStorage
        localStorage.setItem("initiatives", JSON.stringify(data));
      } catch (err) {
        console.error("Supabase fetch failed:", err);
        setError(err instanceof Error ? err.message : "Unknown error");

        // fallback to localStorage
        const saved = localStorage.getItem("initiatives");
        if (saved) {
          try {
            setInitiatives(JSON.parse(saved));
            setError(null);
          } catch {
            console.error("Error parsing saved initiatives");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitiatives();
  }, []);

  const defaultInitiatives = [
    {
      id: "1",
      title: "Startup Bootcamp",
      description: "Three-day intensive workshop for aspiring entrepreneurs.",
      images: [
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80",
      ],
    },
    {
      id: "2",
      title: "Innovation Drive",
      description: "Encouraging tech innovation and creative problem-solving.",
      images: [
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
      ],
    },
    {
      id: "3",
      title: "Women In Business",
      description: "Empowering female founders and entrepreneurs.",
      images: [
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80",
      ],
    },
  ];

  const displayInitiatives =
    initiatives.length > 0 ? initiatives : defaultInitiatives;

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
              {displayInitiatives.map((item, i) => (
                <CarouselItem
                  key={i}
                  className="basis-full sm:basis-1/2 lg:basis-1/3 px-3"
                >
                  <InitiativeCard
                    title={item.title}
                    description={item.description}
                    imageSrc={item.images}
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
