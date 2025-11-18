import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import RevealAnimation from '@/components/RevealAnimation';
import ImageWithFallback from '@/components/ImageWithFallback';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, User, ExternalLink, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  medium_url: string;
  author: string;
  published_date: string;
  featured_image_url?: string;
  tags: string[];
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('blog_posts' as any)
        .select('*')
        .order('published_date', { ascending: false });

      if (error) throw error;
      setBlogPosts((data as unknown as BlogPost[]) || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to load blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="tech-gradient">
      <Navbar />
      <main className="pt-20 relative z-10">
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <RevealAnimation>
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-6">
                  Tech Blog
                </h1>
                <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                  Discover insights, tutorials, and stories from our tech community. Explore the latest trends and innovations in technology.
                </p>
              </div>
            </RevealAnimation>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="glass-effect rounded-xl h-80 mb-4 bg-white/5"></div>
                    <div className="glass-effect rounded h-4 mb-2 bg-white/5"></div>
                    <div className="glass-effect rounded h-4 w-3/4 bg-white/5"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-white/80">
                <p>{error}</p>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center text-white/80">
                <p>No blog posts available at the moment.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                  <RevealAnimation key={post.id} delay={index * 100}>
                    <Card className="group glass-effect hover:bg-white/15 transition-all duration-500 h-full flex flex-col overflow-hidden border-white/10 hover:border-white/20 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
                      {post.featured_image_url && (
                        <div className="aspect-video overflow-hidden relative">
                          <ImageWithFallback
                            src={post.featured_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      )}
                      <CardHeader className="flex-1 p-6">
                        <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.published_date)}</span>
                          <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <CardTitle className="text-white text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-white/70 line-clamp-3 leading-relaxed">
                          {post.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 p-6">
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="bg-primary/20 text-white border-primary/30 hover:bg-primary/30 transition-colors duration-200">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge variant="secondary" className="bg-white/10 text-white/60 border-white/20">
                                +{post.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        <Button 
                          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 group-hover:scale-105"
                          onClick={() => window.open(post.medium_url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Read Article
                        </Button>
                      </CardContent>
                    </Card>
                  </RevealAnimation>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Blog;