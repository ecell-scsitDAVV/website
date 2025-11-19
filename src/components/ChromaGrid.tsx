import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Linkedin, Instagram, Twitter, ExternalLink, User } from 'lucide-react';

export interface ChromaItem {
  image: string;
  title: string;
  subtitle: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
  socialHandles?: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface ChromaGridProps {
  items?: ChromaItem[];
  className?: string;
  radius?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
  imageComponent?: React.FC<{ src: string; alt: string }>;
}

type SetterFn = (v: number | string) => void;

const ChromaGrid: React.FC<ChromaGridProps> = ({
  items = [],
  className = '',
  radius = 320,
  damping = 0.5,
  fadeOut = 0.7,
  ease = 'power3.out',
  imageComponent: CustomImage,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<SetterFn | null>(null);
  const setY = useRef<SetterFn | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  const hasItems = items && items.length > 0;
  const data = hasItems ? items : [];

const prioritizedRoles = [
  'President',
  'Vice-President',
  'Technical Head',
  'Event Head',
  'Marketing Head',
  'Human Resource',
  'Graphic Designer',
  'Event Finance Manager',
  'PR Manager',
  'Business Planner',
  'Buisness Planner',
  'Full Stack Developer',
  'Content Designer',
  'Content Creator',
  'Content Writer',
  'Coordinator',
  'Co-ordinator',
  'Volunteer',
] as const;

const getPriority = (subtitle: string): number => {
  const lower = subtitle.trim().toLowerCase();

  if (lower.includes('president') && !lower.includes('vice-president') && !lower.includes('vice president')) {
    return 0;
  }

  // Then check all other roles in strict order
  for (let i = 1; i < prioritizedRoles.length; i++) {
    if (lower.includes(prioritizedRoles[i].toLowerCase())) {
      return i;
    }
  }

  return 999;
};

const sortedData = [...data].sort((a, b) => {
  const priorityA = getPriority(a.subtitle);
  const priorityB = getPriority(b.subtitle);
  return priorityA - priorityB;
});

  useEffect(() => {
    if (!rootRef.current) return;
    const el = rootRef.current;
    setX.current = gsap.quickSetter(el, '--x', 'px') as SetterFn;
    setY.current = gsap.quickSetter(el, '--y', 'px') as SetterFn; // ← fixed typo

    const updateCenter = () => {
      const { width, height } = el.getBoundingClientRect();
      pos.current = { x: width / 2, y: height / 2 };
      setX.current?.(pos.current.x);
      setY.current?.(pos.current.y);
    };

    updateCenter();
    window.addEventListener('resize', updateCenter);
    return () => window.removeEventListener('resize', updateCenter);
  }, [hasItems]);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = rootRef.current!.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.3 });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, { opacity: 1, duration: fadeOut });
  };

  const handleCardClick = (url?: string) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCardMove: React.MouseEventHandler<HTMLElement> = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const DefaultImage = ({ src, alt }: { src: string; alt: string }) => (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full h-96 object-cover object-top rounded-xl transition-transform duration-700 group-hover:scale-110"
      onError={(e) => {
        e.currentTarget.src = `https://via.placeholder.com/384x384/1a1a1a/ffffff?text=${alt.charAt(0)}`;
      }}
    />
  );

  const ImageComponent = CustomImage || DefaultImage;

  const openSocial = (platform: string, handle?: string) => {
    if (!handle) return;
    const username = handle.replace(/^@/, '');
    const urls: Record<string, string> = {
      linkedin: `https://linkedin.com/in/${username}`,
      instagram: `https://instagram.com/${username}`,
      twitter: `https://x.com/${username}`,
    };
    window.open(urls[platform], '_blank', 'noopener,noreferrer');
  };

  const hasSocials = (handles?: ChromaItem['socialHandles']) =>
    handles && (handles.linkedin || handles.instagram || handles.twitter);

  if (!hasItems || data.length === 0) {
    return (
      <div className="text-center py-32 text-white/60">
        <p className="text-2xl">No team members to display</p>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`relative w-full min-h-screen flex flex-wrap justify-center items-start gap-8 py-16 px-8 ${className}`}
      style={{
        '--r': `${radius}px`,
        '--x': '50%',
        '--y': '50%',
      } as React.CSSProperties}
    >
      {sortedData.map((item, i) => {

        return (
          <article
            key={i}
            onClick={() => handleCardClick(item.url)}
            onMouseMove={handleCardMove}
            className="group relative w-96 rounded-3xl overflow-hidden border-2 border-transparent cursor-pointer transition-all duration-500 hover:border-white/30 shadow-2xl"
            style={{
              background: item.gradient,
              '--card-border': item.borderColor,
              '--spotlight-color': 'rgba(255,255,255,0.26)',
            } as React.CSSProperties}
          >
            {/* Spotlight Effect */}
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20"
              style={{
                background:
                  'radial-gradient(700px circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 40%)',
              }}
            />

            {/* Image */}
            <div className="relative z-10 p-4">
              <ImageComponent src={item.image} alt={item.title} />
            </div>

            {/* Content */}
            <footer className="relative z-10 p-7 text-white">
              <div className="flex justify-between items-start mb-5">
                <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
                {item.url && (
                  <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 transition" />
                )}
              </div>

              <p className="text-base opacity-90 mb-7 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                {item.subtitle}
              </p>

              {/* Social Links or Dummy Icon */}
              <div className="flex justify-center gap-5">
                {hasSocials(item.socialHandles) ? (
                  <>
                    {item.socialHandles?.linkedin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openSocial('linkedin', item.socialHandles!.linkedin);
                        }}
                        className="p-3.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all hover:scale-110 shadow-lg"
                        aria-label={`LinkedIn - ${item.socialHandles!.linkedin}`}
                      >
                        <Linkedin className="w-6 h-6" />
                      </button>
                    )}
                    {item.socialHandles?.instagram && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openSocial('instagram', item.socialHandles!.instagram);
                        }}
                        className="p-3.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all hover:scale-110 shadow-lg"
                        aria-label={`Instagram - ${item.socialHandles!.instagram}`}
                      >
                        <Instagram className="w-6 h-6" />
                      </button>
                    )}
                    {item.socialHandles?.twitter && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openSocial('twitter', item.socialHandles!.twitter);
                        }}
                        className="p-3.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all hover:scale-110 shadow-lg"
                        aria-label={`X/Twitter - ${item.socialHandles!.twitter}`}
                      >
                        <Twitter className="w-6 h-6" />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
                    <User className="w-6 h-6 text-white/40" />
                  </div>
                )}
              </div>
            </footer>
          </article>
        );
      })}

      {/* Darkening Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background: 'rgba(0,0,0,0.001)',
          maskImage: `radial-gradient(circle ${radius}px at var(--x) var(--y), transparent 0%, black 100%)`,
          WebkitMaskImage: `radial-gradient(circle ${radius}px at var(--x) var(--y), transparent 0%, black 100%)`,
          backdropFilter: 'grayscale(1) brightness(0.82)',
          WebkitBackdropFilter: 'grayscale(1) brightness(0.82)',
        }}
      />

      {/* Fade Layer */}
      <div
        ref={fadeRef}
        className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-700"
        style={{
          background: 'rgba(0,0,0,0.001)',
          maskImage: `radial-gradient(circle ${radius}px at var(--x) var(--y), white 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle ${radius}px at var(--x) var(--y), white 0%, transparent 100%)`,
          backdropFilter: 'grayscale(1) brightness(0.82)',
          WebkitBackdropFilter: 'grayscale(1) brightness(0.82)',
        }}
      />
    </div>
  );
};

export default ChromaGrid;