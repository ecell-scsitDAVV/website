import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import RevealAnimation from '@/components/RevealAnimation';
import ChromaGrid, { ChromaItem } from '@/components/ChromaGrid';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Helmet } from "react-helmet";

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

// Color schemes for ChromaGrid
const colorSchemes = [
  { borderColor: '#4F46E5', gradient: 'linear-gradient(145deg,#4F46E5,#000)' },
  { borderColor: '#10B981', gradient: 'linear-gradient(210deg,#10B981,#000)' },
  { borderColor: '#F59E0B', gradient: 'linear-gradient(165deg,#F59E0B,#000)' },
  { borderColor: '#EF4444', gradient: 'linear-gradient(195deg,#EF4444,#000)' },
  { borderColor: '#8B5CF6', gradient: 'linear-gradient(225deg,#8B5CF6,#000)' },
  { borderColor: '#06B6D4', gradient: 'linear-gradient(135deg,#06B6D4,#000)' },
  { borderColor: '#EC4899', gradient: 'linear-gradient(180deg,#EC4899,#000)' },
  { borderColor: '#F97316', gradient: 'linear-gradient(270deg,#F97316,#000)' },
];

const Team: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState<string>('2024-25');
  const navigate = useNavigate();

  const fetchTeamMembers = async (): Promise<TeamMember[]> => {
    const { data: members, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('batch_year', selectedBatch)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const membersWithLinks = await Promise.all(
      members.map(async (member) => {
        const { data: socialLinks } = await supabase
          .from('member_social_links')
          .select('id, icon, url')
          .eq('member_id', member.id);

        return {
          ...member,
          socialLinks: socialLinks || []
        };
      })
    );

    return membersWithLinks;
  };

  const { data: members = [], isLoading, error } = useQuery({
    queryKey: ['team-members', selectedBatch],
    queryFn: fetchTeamMembers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Extract clean username from social URLs
  const extractUsername = (url: string, platform: string): string => {
    try {
      const cleanUrl = url.trim();
      if (cleanUrl.startsWith('data:')) return ''; // skip base64
      const urlObj = new URL(cleanUrl);
      const path = urlObj.pathname;

      switch (platform.toLowerCase()) {
        case 'linkedin':
          const liMatch = path.match(/\/in\/([^\/?#]+)/);
          return liMatch ? `@${liMatch[1]}` : '';
        case 'instagram':
          const igMatch = path.match(/^\/([^\/?#]+)\//);
          return igMatch && igMatch[1] ? `@${igMatch[1]}` : '';
        case 'twitter':
        case 'x':
          const twMatch = path.match(/^\/([^\/?#]+)/);
          return twMatch && twMatch[1] ? `@${twMatch[1]}` : '';
        default:
          return '';
      }
    } catch {
      return '';
    }
  };

  const chromaItems: ChromaItem[] = members.map((member, index) => {
    const colors = colorSchemes[index % colorSchemes.length];

    const socialHandles: any = {};
    member.socialLinks?.forEach(link => {
      const url = link.url.toLowerCase();
      const icon = link.icon.toLowerCase();

      if (url.includes('linkedin') || icon.includes('linkedin')) {
        socialHandles.linkedin = extractUsername(link.url, 'linkedin');
      }
      if (url.includes('instagram') || icon.includes('instagram')) {
        socialHandles.instagram = extractUsername(link.url, 'instagram');
      }
      if (url.includes('twitter') || url.includes('x.com') || icon.includes('twitter')) {
        socialHandles.twitter = extractUsername(link.url, 'twitter');
      }
    });

    const primaryLink = member.socialLinks?.find(l =>
      l.url.includes('linkedin.com')
    ) || member.socialLinks?.[0];

    return {
      image: member.image_url,
      title: member.name.trim(),
      subtitle: member.position,
      socialHandles,
      borderColor: colors.borderColor,
      gradient: colors.gradient,
      url: primaryLink?.url || undefined,
      // Force consistent image rendering
      imageProps: {
        loading: "lazy" as const,
        className: "object-cover w-full h-full",
        style: { objectPosition: "top" }
      }
    };
  });

  // Custom Image Component for ChromaGrid to enforce fixed height
  const ChromaImageWrapper = ({ src, alt }: { src: string; alt: string }) => (
    <div className="w-full h-full overflow-hidden bg-gray-900">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-110"
        style={{
          minHeight: '420px',
          aspectRatio: '3/4'
        }}
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/400x533/1a1a1a/ffffff?text=No+Image';
        }}
      />
    </div>
  );

  if (isLoading) {
    return (
      <div className="tech-gradient min-h-screen py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-white/20 rounded w-48 mb-8"></div>
            <div className="h-16 bg-white/30 rounded w-96 mx-auto mb-12"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20">
                  <div className="h-96 md:h-[420px] bg-white/5"></div>
                  <div className="p-6 text-center">
                    <div className="h-6 bg-white/30 rounded mb-3 mx-auto w-4/5"></div>
                    <div className="h-4 bg-white/20 rounded mx-auto w-3/5"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tech-gradient min-h-screen py-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Our Team</h1>
          <p className="text-red-400 text-lg">Failed to load team members. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tech-gradient min-h-screen py-24 px-4">
      <Helmet>
        <title>Team - E-Cell SCSIT, DAVV</title>
        <meta name="description" content="The Entrepreneurship Cell - SCSIT here is the official Entrepreneurship Cell of SCSIT, DAVV Indore. We foster innovation, startups, and tech-driven student initiatives." />
        <link rel="canonical" href="https://ecell-davv.vercel.app/" />
      </Helmet>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <RevealAnimation>
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white">
              Our Team
            </h1>
            <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
              Meet the passionate leaders driving innovation and building the future of entrepreneurship.
            </p>

            <div className="flex justify-center mt-10">
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-56 bg-white/10 border-white/30 text-white placeholder:text-white/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-25">Batch 2024-25</SelectItem>
                  <SelectItem value="2023-24">Batch 2023-24</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </RevealAnimation>

        {members.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/70 text-xl">No team members found for {selectedBatch}</p>
          </div>
        ) : (
          <div className="relative">
            <ChromaGrid
              items={chromaItems}
              radius={320}
              damping={0.5}
              fadeOut={0.7}
              ease="power3.out"
              imageComponent={ChromaImageWrapper} // Enforce fixed height
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;