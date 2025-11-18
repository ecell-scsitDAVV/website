import React, { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import RevealAnimation from "./RevealAnimation";
import { supabase } from "@/integrations/supabase/client";
interface Testimonial {
  id: string;
  name: string;
  message: string;
  image_url: string | null;
  position?: string;
}
const AUTO_SLIDE_INTERVAL = 3500; // milliseconds
const ANIMATION_STAGGER = 120; // ms

const TestimonialsSection: React.FC = () => {
  const isMobile = useIsMobile();
  const [current, setCurrent] = React.useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch testimonials from database
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('testimonials').select('*').order('created_at', {
          ascending: false
        });
        if (error) {
          console.error('Error fetching testimonials:', error);
          return;
        }
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Auto-slide effect for infinite loop
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [testimonials.length]);
  if (loading) {
    return <section className="testimonials-section px-4 py-8 tech-gradient relative">{/* Updated background */}
        <div className="relative z-10">{/* Ensure content is above gradient overlay */}
          <h2 className="text-2xl font-bold mb-8 text-center text-white">
            Testimonials
          </h2>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>;
  }
  if (testimonials.length === 0) {
    return <section className="testimonials-section px-4 py-8 tech-gradient relative">{/* Updated background */}
        <div className="relative z-10">{/* Ensure content is above gradient overlay */}
          <h2 className="text-2xl font-bold mb-8 text-center text-white">
            Testimonials
          </h2>
          <div className="text-center text-white/70">
            No testimonials available at the moment.
          </div>
        </div>
      </section>;
  }
  return <section className="testimonials-section px-4 py-8 tech-gradient relative">{/* Updated background */}
      <div className="relative z-10">{/* Ensure content is above gradient overlay */}
        <h2 className="text-2xl font-bold mb-8 text-center text-white">
          Testimonials
        </h2>
      <div className="max-w-2xl md:max-w-3xl lg:max-w-6xl mx-auto relative">
        <Carousel opts={{
        loop: true,
        slidesToScroll: 1
      }} className="w-full" setApi={api => {
        if (api && api.scrollTo) {
          api.scrollTo(current);
        }
      }}>
          <CarouselContent>
            {testimonials.map((testimonial, index) => <CarouselItem key={index} className={`flex justify-center items-stretch pb-8` + (isMobile ? " basis-full max-w-[90vw]" : " basis-1/3 max-w-[400px]") + " transition-all duration-300"}>
                <RevealAnimation delay={index * ANIMATION_STAGGER} className="h-full w-full">
                  <div className="testimonial-card flex flex-col p-6 border rounded-lg shadow-lg glass-effect w-full h-full max-w-md min-h-[220px] mx-auto border-white/20">{/* Updated to glass effect */}
                    <div className="flex flex-col items-center flex-1">
                      {testimonial.image_url ? (
                        <img src={testimonial.image_url} alt={testimonial.name} className="w-20 h-20 rounded-full mb-4 object-cover" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <span className="text-primary font-semibold text-2xl">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <h3 className="font-semibold text-lg mb-2 text-white text-center">
                        {testimonial.name}
                      </h3>
                      <p className="text-white/70 text-center whitespace-pre-line break-words">
                        {testimonial.message}
                      </p>
                      {testimonial.position && <span className="mt-2 text-xs text-white/60 italic">{testimonial.position}</span>}
                    </div>
                  </div>
                </RevealAnimation>
              </CarouselItem>)}
          </CarouselContent>
          <CarouselPrevious className={isMobile ? "-left-4 top-1/2" : "-left-12 top-1/2"} />
          <CarouselNext className={isMobile ? "-right-4 top-1/2" : "-right-12 top-1/2"} />
        </Carousel>
      </div>
    </div>
    </section>;
};
export default TestimonialsSection;