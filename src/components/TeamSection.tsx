import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RevealAnimation from './RevealAnimation';
import ImageWithFallback from './ImageWithFallback';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";

interface SocialLink {
  id?: string;
  icon: string;
  url: string;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image_url: string;
  batch_year: string;
  socialLinks: SocialLink[];
}

interface TeamMemberProps {
  name: string;
  position: string;
  imageSrc: string;
  socialLinks: { icon: string; url: string }[];
  delay?: number;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, position, imageSrc, socialLinks, delay = 0 }) => {
  const getSocialIconColor = (platform: string) => {
    switch (platform) {
      case 'linkedin': return 'bg-[#0A66C2]';
      case 'twitter': return 'bg-[#1DA1F2]';
      case 'instagram': return 'bg-[#E4405F]';
      case 'facebook': return 'bg-[#1877F2]';
      case 'github': return 'bg-[#171515]';
      default: return 'bg-[#6e5494]';
    }
  };

  return (
    <RevealAnimation delay={delay} className="h-full">
      <div className="team-card relative bg-white dark:bg-black rounded-lg overflow-hidden h-full">
        <div className="overflow-hidden aspect-[3/4]">
          <ImageWithFallback
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="p-5 text-center">
          <h3 className="text-xl font-semibold mb-1 text-primary">{name}</h3>
          <p className="text-blue-500 text-sm mb-3 font-medium">{position}</p>
          
          <div className="flex justify-center space-x-3">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-8 h-8 flex items-center justify-center rounded-full ${getSocialIconColor(link.icon)} text-white hover:opacity-90 transition-opacity duration-300`}
                aria-label={`${name}'s ${link.icon}`}
              >
                <i className={`fab fa-${link.icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </RevealAnimation>
  );
};

const STAGGER_DELAY = 160;

const TeamSection: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [api, setApi] = useState<any>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!api) return;
    
    const autoPlayInterval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    
    return () => clearInterval(autoPlayInterval);
  }, [api]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch only latest batch members for preview (limit to 6)
        const { data: members, error: membersError } = await supabase
          .from('team_members')
          .select('*')
          .eq('batch_year', '2024-25')
          .order('created_at', { ascending: false })
          .limit(6);

        if (membersError) {
          throw new Error(`Error fetching team members: ${membersError.message}`);
        }

        const membersWithLinks = await Promise.all(
          members.map(async (member) => {
            const { data: socialLinks, error: linksError } = await supabase
              .from('member_social_links')
              .select('*')
              .eq('member_id', member.id);

            if (linksError) {
              console.error(`Error fetching social links for member ${member.id}:`, linksError);
              return { ...member, socialLinks: [] };
            }

            return {
              ...member,
              socialLinks: socialLinks || []
            };
          })
        );

        setTeamMembers(membersWithLinks);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        
        // If there's an error fetching from Supabase, try to load from localStorage as fallback
        const savedMembers = localStorage.getItem('team_members');
        if (savedMembers) {
          try {
            setTeamMembers(JSON.parse(savedMembers));
            setError(null);
          } catch (parseErr) {
            console.error("Error parsing team members from localStorage:", parseErr);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // If loading, show skeleton
  if (isLoading) {
    return (
      <section id="team" className="py-24 px-4 bg-secondary/30 tech-gradient">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block py-1 px-3 mb-3 text-xs tracking-wider uppercase rounded-full bg-secondary text-primary font-medium">Our Team</span>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Meet The Leaders</h2>
            <p className="text-muted-foreground max-w-md mt-4 md:mt-0">
              Dedicated individuals committed to fostering innovation and entrepreneurship in our community.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-black rounded-lg overflow-hidden h-full">
                <div className="aspect-[3/4] bg-gray-200 animate-pulse"></div>
                <div className="p-5 text-center">
                  <div className="h-6 bg-gray-200 animate-pulse rounded mb-2 mx-auto w-3/4"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded mb-3 mx-auto w-1/2"></div>
                  <div className="flex justify-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error message if there's an error and no data
  if (error && teamMembers.length === 0) {
    return (
      <section id="team" className="py-24 px-4 bg-secondary/30 tech-gradient">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block py-1 px-3 mb-3 text-xs tracking-wider uppercase rounded-full bg-secondary text-primary font-medium">Our Team</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Meet The Leaders</h2>
          <p className="text-destructive">Error loading team members. Please try again later.</p>
        </div>
      </section>
    );
  }

  // Use default members if none were found
  const displayMembers = teamMembers.length > 0 ? teamMembers : [
    {
      id: "1",
      name: "Alex Johnson",
      position: "President",
      image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80",
      batch_year: "2024-25",
      socialLinks: [
        { icon: "linkedin", url: "#" },
        { icon: "twitter", url: "#" },
        { icon: "instagram", url: "#" }
      ]
    },
    {
      id: "2",
      name: "Sophia Martinez",
      position: "Vice President",
      image_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
      batch_year: "2024-25",
      socialLinks: [
        { icon: "linkedin", url: "#" },
        { icon: "twitter", url: "#" }
      ]
    },
    {
      id: "3",
      name: "David Chen",
      position: "Secretary",
      image_url: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=769&q=80",
      batch_year: "2024-25",
      socialLinks: [
        { icon: "linkedin", url: "#" },
        { icon: "instagram", url: "#" }
      ]
    }
  ];

  return (
    <section id="team" className="py-24 px-4 bg-secondary/30 tech-gradient">
      <div className="max-w-7xl mx-auto">
        <RevealAnimation>
          <span className="inline-block py-1 px-3 mb-3 text-xs tracking-wider uppercase rounded-full bg-secondary text-primary font-medium">Our Team</span>
        </RevealAnimation>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12">
          <RevealAnimation delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Meet The Leaders</h2>
          </RevealAnimation>
          
          <RevealAnimation delay={200}>
            <p className="text-muted-foreground max-w-md mt-4 md:mt-0">
              Dedicated individuals committed to fostering innovation and entrepreneurship in our community.
            </p>
          </RevealAnimation>
        </div>
        
        <Carousel 
          opts={{ 
            align: "start",
            slidesToScroll: isMobile ? 1 : 3,
            loop: true
          }}
          className="w-full mb-8"
          setApi={setApi}
        >
          <CarouselContent className="-ml-4">
            {displayMembers.slice(0, 6).map((member, index) => (
              <CarouselItem 
                key={member.id} 
                className={isMobile ? "pl-4 basis-full" : "pl-4 md:basis-1/3"}
              >
                <TeamMember
                  name={member.name}
                  position={member.position}
                  imageSrc={member.image_url}
                  socialLinks={member.socialLinks}
                  delay={index * STAGGER_DELAY}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <RevealAnimation delay={400}>
          <div className="text-center">
            <Link to="/team">
              <Button size="lg" className="px-8 py-3">
                View All Team Members
              </Button>
            </Link>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default TeamSection;
