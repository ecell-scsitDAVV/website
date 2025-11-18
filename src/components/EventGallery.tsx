import React, { useEffect, useState } from 'react';
import RevealAnimation from './RevealAnimation';
import ImageWithFallback from './ImageWithFallback';
import { supabase } from "@/integrations/supabase/client";
interface GalleryItem {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url: string;
}
const EventGallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch gallery items
        const {
          data,
          error: fetchError
        } = await supabase.from('gallery_items').select('*').order('date', {
          ascending: false
        });
        if (fetchError) {
          throw new Error(`Error fetching gallery items: ${fetchError.message}`);
        }
        setGalleryItems(data);
      } catch (err) {
        console.error("Error fetching gallery items:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');

        // If there's an error fetching from Supabase, try to load from localStorage as fallback
        const savedGallery = localStorage.getItem('gallery_items');
        if (savedGallery) {
          try {
            setGalleryItems(JSON.parse(savedGallery));
            setError(null); // Clear error if we could load from localStorage
          } catch (parseErr) {
            console.error("Error parsing gallery items from localStorage:", parseErr);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchGalleryItems();
  }, []);
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Default gallery items if none were found
  const defaultGalleryItems = [{
    id: "1",
    title: "Entrepreneurship Summit 2023",
    description: "Annual flagship event featuring renowned speakers and workshops",
    date: "2023-10-15",
    image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  }, {
    id: "2",
    title: "Startup Pitch Competition",
    description: "Students presenting innovative business ideas to industry experts",
    date: "2023-09-22",
    image_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  }, {
    id: "3",
    title: "Business Plan Workshop",
    description: "Interactive session on creating effective business plans",
    date: "2023-08-10",
    image_url: "https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  }];

  // Use default items if none were found
  const displayItems = galleryItems.length > 0 ? galleryItems : defaultGalleryItems;
  return <section id="gallery" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealAnimation>
          <span className="inline-block py-1 px-3 mb-3 text-xs tracking-wider uppercase rounded-full bg-secondary text-primary font-medium">Gallery</span>
        </RevealAnimation>

        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12">
          <RevealAnimation delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Our Events & Milestones
            </h2>
          </RevealAnimation>

          <RevealAnimation delay={200}>
            <p className="max-w-md mt-4 md:mt-0 text-zinc-900">
              Explore our achievements and the exciting events we've organized throughout the years.
            </p>
          </RevealAnimation>
        </div>

        {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => <div key={n} className="bg-card rounded-xl overflow-hidden">
                <div className="aspect-[16/9] bg-gray-200 animate-pulse"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-1/4"></div>
                  <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                </div>
              </div>)}
          </div> : error && displayItems === defaultGalleryItems ? <div className="text-center py-8">
            <p className="text-destructive">Error loading gallery items. Using default content.</p>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayItems.map((item, index) => <RevealAnimation key={item.id} delay={index * 100}>
                <div className="group bg-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="overflow-hidden aspect-video">
                    <ImageWithFallback src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-5">
                    <span className="text-sm text-muted-foreground">{formatDate(item.date)}</span>
                    <h3 className="text-xl font-semibold mt-1 mb-2">{item.title}</h3>
                    <p className="text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                </div>
              </RevealAnimation>)}
          </div>}
      </div>
    </section>;
};
export default EventGallery;