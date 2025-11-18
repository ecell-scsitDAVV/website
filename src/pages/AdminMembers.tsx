import React, { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit, UserPlus, Upload } from "lucide-react";
import ImageWithFallback from '@/components/ImageWithFallback';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

const AdminMembers: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string>('2024-25');
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    imageSrc: '',
    batchYear: '2024-25',
    linkedinUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    facebookUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `member_${Date.now()}.${fileExt}`;
      const filePath = `members/${fileName}`;

      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      clearInterval(interval);
      setUploadProgress(100);

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      setFormData({
        ...formData,
        imageSrc: publicUrl
      });

      toast({
        title: "File uploaded",
        description: "Image has been uploaded successfully."
      });

    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError(error instanceof Error ? error.message : "An unknown error occurred");
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch team members from Supabase
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

  // Add a new team member
  const addMemberMutation = useMutation({
    mutationFn: async (newMember: Omit<TeamMember, 'id' | 'socialLinks'> & { socialLinks: Omit<SocialLink, 'id'>[] }) => {
      const { data: memberData, error: memberError } = await supabase
        .from('team_members')
        .insert({
          name: newMember.name,
          position: newMember.position,
          image_url: newMember.image_url,
          batch_year: newMember.batch_year
        })
        .select()
        .single();

      if (memberError) {
        throw new Error(`Error adding team member: ${memberError.message}`);
      }

      if (newMember.socialLinks.length > 0) {
        const socialLinksToInsert = newMember.socialLinks.map(link => ({
          member_id: memberData.id,
          icon: link.icon,
          url: link.url
        }));

        const { error: linksError } = await supabase
          .from('member_social_links')
          .insert(socialLinksToInsert);

        if (linksError) {
          throw new Error(`Error adding social links: ${linksError.message}`);
        }
      }

      return memberData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: "Member added",
        description: "Team member has been added successfully."
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add team member."
      });
    }
  });

  // Update an existing team member
  const updateMemberMutation = useMutation({
    mutationFn: async (updatedMember: TeamMember) => {
      const { error: memberError } = await supabase
        .from('team_members')
        .update({
          name: updatedMember.name,
          position: updatedMember.position,
          image_url: updatedMember.image_url,
          batch_year: updatedMember.batch_year
        })
        .eq('id', updatedMember.id);

      if (memberError) {
        throw new Error(`Error updating team member: ${memberError.message}`);
      }

      const { error: deleteError } = await supabase
        .from('member_social_links')
        .delete()
        .eq('member_id', updatedMember.id);

      if (deleteError) {
        throw new Error(`Error deleting old social links: ${deleteError.message}`);
      }

      if (updatedMember.socialLinks.length > 0) {
        const socialLinksToInsert = updatedMember.socialLinks.map(link => ({
          member_id: updatedMember.id,
          icon: link.icon,
          url: link.url
        }));

        const { error: linksError } = await supabase
          .from('member_social_links')
          .insert(socialLinksToInsert);

        if (linksError) {
          throw new Error(`Error adding updated social links: ${linksError.message}`);
        }
      }

      return updatedMember;
    },
    onSuccess: (updatedMember) => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: "Member updated",
        description: `${updatedMember.name}'s information has been updated.`
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update team member."
      });
    }
  });

  // Delete a team member
  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Error deleting team member: ${error.message}`);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: "Member deleted",
        description: "Team member has been removed successfully."
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete team member."
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      imageSrc: '',
      batchYear: '2024-25',
      linkedinUrl: '',
      twitterUrl: '',
      instagramUrl: '',
      facebookUrl: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadProgress(0);
    setUploadError(null);
  };

  const handleAddMember = () => {
    setEditingMember(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    
    const formData = {
      name: member.name,
      position: member.position,
      imageSrc: member.image_url,
      batchYear: member.batch_year,
      linkedinUrl: member.socialLinks.find(link => link.icon === 'linkedin')?.url || '',
      twitterUrl: member.socialLinks.find(link => link.icon === 'twitter')?.url || '',
      instagramUrl: member.socialLinks.find(link => link.icon === 'instagram')?.url || '',
      facebookUrl: member.socialLinks.find(link => link.icon === 'facebook')?.url || ''
    };
    
    setFormData(formData);
    setIsDialogOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      deleteMemberMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const socialLinks: Omit<SocialLink, 'id'>[] = [];
    
    if (formData.linkedinUrl) socialLinks.push({ icon: 'linkedin', url: formData.linkedinUrl });
    if (formData.twitterUrl) socialLinks.push({ icon: 'twitter', url: formData.twitterUrl });
    if (formData.instagramUrl) socialLinks.push({ icon: 'instagram', url: formData.instagramUrl });
    if (formData.facebookUrl) socialLinks.push({ icon: 'facebook', url: formData.facebookUrl });
    
    if (editingMember) {
      updateMemberMutation.mutate({
        id: editingMember.id,
        name: formData.name,
        position: formData.position,
        image_url: formData.imageSrc,
        batch_year: formData.batchYear,
        socialLinks
      });
    } else {
      addMemberMutation.mutate({
        name: formData.name,
        position: formData.position,
        image_url: formData.imageSrc,
        batch_year: formData.batchYear,
        socialLinks
      });
    }
  };

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive">Error loading team members: {error instanceof Error ? error.message : 'Unknown error'}</p>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['team-members'] })}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Team Members</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddMember}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Edit' : 'Add'} Team Member</DialogTitle>
              <DialogDescription>
                {editingMember 
                  ? "Update the team member's information below." 
                  : "Fill in the details to add a new team member."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">
                    Position
                  </Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="batchYear" className="text-right">
                    Batch Year
                  </Label>
                  <div className="col-span-3">
                    <Select value={formData.batchYear} onValueChange={(value) => setFormData({...formData, batchYear: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="imageUpload" className="text-right pt-2">
                    Image
                  </Label>
                  <div className="col-span-3 space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        ref={fileInputRef}
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                    </div>
                    
                    {isUploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                    
                    {uploadError && (
                      <p className="text-sm text-destructive">{uploadError}</p>
                    )}
                    
                    {formData.imageSrc && !isUploading && (
                      <div className="relative aspect-square w-32 overflow-hidden rounded-md border mx-auto mb-2">
                        <img 
                          src={formData.imageSrc} 
                          alt="Preview" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    
                    <Input
                      placeholder="Or enter image URL manually"
                      value={formData.imageSrc}
                      onChange={(e) => setFormData({...formData, imageSrc: e.target.value})}
                      className="w-full"
                      required={!formData.imageSrc}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right col-span-4 -mb-2 font-bold">
                    Social Links
                  </Label>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="linkedinUrl" className="text-right">
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                    className="col-span-3"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="twitterUrl" className="text-right">
                    Twitter
                  </Label>
                  <Input
                    id="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={(e) => setFormData({...formData, twitterUrl: e.target.value})}
                    className="col-span-3"
                    placeholder="https://twitter.com/username"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="instagramUrl" className="text-right">
                    Instagram
                  </Label>
                  <Input
                    id="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})}
                    className="col-span-3"
                    placeholder="https://instagram.com/username"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="facebookUrl" className="text-right">
                    Facebook
                  </Label>
                  <Input
                    id="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})}
                    className="col-span-3"
                    placeholder="https://facebook.com/username"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting || isUploading}>
                  {isSubmitting || isUploading ? "Processing..." : editingMember ? 'Update' : 'Add'} Member
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-center mb-6">
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

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="overflow-hidden">
              <div className="h-64 bg-gray-200 animate-pulse" />
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 animate-pulse rounded mb-2" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3 mb-3" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full" />
                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">No team members found for the selected batch. Add your first team member!</p>
          <Button onClick={handleAddMember}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <div className="relative">
                <ImageWithFallback
                  src={member.image_url}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button 
                    variant="default" 
                    size="icon" 
                    className="h-8 w-8 bg-primary/80 hover:bg-primary"
                    onClick={() => handleEditMember(member)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-8 w-8 bg-destructive/80 hover:bg-destructive"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-muted-foreground text-sm mb-1">{member.position}</p>
                <p className="text-blue-500 text-xs mb-3 font-medium">Batch {member.batch_year}</p>
                
                <div className="flex gap-2">
                  {member.socialLinks.map((link, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      asChild
                    >
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <i className={`fab fa-${link.icon}`}></i>
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
