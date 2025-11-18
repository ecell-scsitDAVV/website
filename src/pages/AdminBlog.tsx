import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, User, ExternalLink, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface BlogPostForm {
  title: string;
  description: string;
  medium_url: string;
  author: string;
  published_date: string;
  featured_image_url: string;
  tags: string;
}

const AdminBlog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogPostForm>({
    title: '',
    description: '',
    medium_url: '',
    author: '',
    published_date: '',
    featured_image_url: '',
    tags: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchBlogPosts = async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase
      .from('blog_posts' as any)
      .select('*')
      .order('published_date', { ascending: false });

    if (error) throw error;
    return (data as unknown as BlogPost[]) || [];
  };

  const { data: blogPosts = [], isLoading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: fetchBlogPosts
  });

  const addPostMutation = useMutation({
    mutationFn: async (newPost: Omit<BlogPost, 'id'>) => {
      const { data, error } = await supabase
        .from('blog_posts' as any)
        .insert([newPost])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({ title: "Blog post added successfully!" });
      resetForm();
    },
    onError: (error) => {
      toast({ 
        title: "Error adding blog post", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BlogPost> & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_posts' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({ title: "Blog post updated successfully!" });
      resetForm();
    },
    onError: (error) => {
      toast({ 
        title: "Error updating blog post", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({ title: "Blog post deleted successfully!" });
    },
    onError: (error) => {
      toast({ 
        title: "Error deleting blog post", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      medium_url: '',
      author: '',
      published_date: '',
      featured_image_url: '',
      tags: ''
    });
    setEditingPost(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, ...postData });
    } else {
      addPostMutation.mutate(postData);
    }
  };

  const handleAddPost = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      description: post.description,
      medium_url: post.medium_url,
      author: post.author,
      published_date: post.published_date,
      featured_image_url: post.featured_image_url || '',
      tags: post.tags.join(', ')
    });
    setIsDialogOpen(true);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      deletePostMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600">
          Error loading blog posts: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddPost}>
              <Plus className="w-4 h-4 mr-2" />
              Add Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="medium_url">Medium Blog URL</Label>
                <Input
                  id="medium_url"
                  type="url"
                  value={formData.medium_url}
                  onChange={(e) => setFormData({ ...formData, medium_url: e.target.value })}
                  required
                  placeholder="https://medium.com/@author/post-title"
                />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="published_date">Published Date</Label>
                <Input
                  id="published_date"
                  type="date"
                  value={formData.published_date}
                  onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="featured_image_url">Featured Image URL (Optional)</Label>
                <Input
                  id="featured_image_url"
                  type="url"
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="React, JavaScript, Web Development"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={addPostMutation.isPending || updatePostMutation.isPending}>
                  {editingPost ? 'Update' : 'Add'} Blog Post
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {blogPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {post.title}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(post.medium_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {post.description}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.published_date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </span>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPost(post)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminBlog;