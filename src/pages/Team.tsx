
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

// Color schemes for ChromaGrid cards
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

    if (error) {
      throw new Error(`Error fetching team members: ${error.message}`);
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

    return membersWithLinks;
  };

  const { data: members = [], isLoading, error } = useQuery({
    queryKey: ['team-members', selectedBatch],
    queryFn: fetchTeamMembers
  });

  // Convert team members to ChromaGrid items
  const chromaItems: ChromaItem[] = members.map((member, index) => {
    const colorScheme = colorSchemes[index % colorSchemes.length];
    
    // Helper function to extract username from URL
    const extractUsername = (url: string, platform: string): string => {
      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        
        switch (platform) {
          case 'linkedin':
            // Extract from linkedin.com/in/username or linkedin.com/in/username/
            const linkedinMatch = pathname.match(/\/in\/([^\/]+)/);
            return linkedinMatch ? `@${linkedinMatch[1]}` : '';
          
          case 'instagram':
            // Extract from instagram.com/username or instagram.com/username/
            const instagramMatch = pathname.match(/\/([^\/]+)/);
            return instagramMatch && instagramMatch[1] !== '' ? `@${instagramMatch[1]}` : '';
          
          case 'twitter':
            // Extract from twitter.com/username or x.com/username
            const twitterMatch = pathname.match(/\/([^\/]+)/);
            return twitterMatch && twitterMatch[1] !== '' ? `@${twitterMatch[1]}` : '';
          
          default:
            return '';
        }
      } catch (error) {
        console.error(`Error parsing URL ${url}:`, error);
        return '';
      }
    };
    
    // Extract social handles from social links
    const socialHandles: { linkedin?: string; instagram?: string; twitter?: string } = {};
    
    member.socialLinks?.forEach(link => {
      const url = link.url.toLowerCase();
      const icon = link.icon.toLowerCase();
      
      if (url.includes('linkedin.com') || icon.includes('linkedin')) {
        const username = extractUsername(link.url, 'linkedin');
        if (username) socialHandles.linkedin = username;
      } else if (url.includes('instagram.com') || icon.includes('instagram')) {
        const username = extractUsername(link.url, 'instagram');
        if (username) socialHandles.instagram = username;
      } else if (url.includes('twitter.com') || url.includes('x.com') || icon.includes('twitter')) {
        const username = extractUsername(link.url, 'twitter');
        if (username) socialHandles.twitter = username;
      }
    });
    
    // Get primary social link for click action (prioritize LinkedIn, then Instagram, then Twitter)
    const primarySocialLink = member.socialLinks?.find(link => 
      link.url.toLowerCase().includes('linkedin.com')
    ) || member.socialLinks?.find(link => 
      link.url.toLowerCase().includes('instagram.com')
    ) || member.socialLinks?.find(link => 
      link.url.toLowerCase().includes('twitter.com') || link.url.toLowerCase().includes('x.com')
    );
    
    return {
      image: member.image_url,
      title: member.name,
      subtitle: member.position,
      socialHandles,
      borderColor: colorScheme.borderColor,
      gradient: colorScheme.gradient,
      url: primarySocialLink?.url
    };
  });

  if (isLoading) {
    return (
      <div className="tech-gradient py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">Our Team</h1>
            <div className="h-10 bg-gray-200 animate-pulse rounded mb-8 w-48 mx-auto"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="tech-gradient py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">Our Team</h1>
          <p className="text-destructive">Error loading team members. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tech-gradient py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <RevealAnimation>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">Our Team</h1>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Meet the dedicated individuals committed to fostering innovation and entrepreneurship in our community.
            </p>
            
            <div className="flex justify-center mb-8">
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select batch year" />
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
          <div className="text-center p-8">
            <p className="text-white/80">No team members found for the selected batch.</p>
          </div>
        ) : (
          <div style={{ position: 'relative', minHeight: '600px' }}>
            <ChromaGrid 
              items={chromaItems}
              radius={300}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
