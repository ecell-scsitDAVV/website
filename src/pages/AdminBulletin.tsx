import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Plus, Link, Image, File, Paperclip } from "lucide-react";

interface BulletinItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  has_attachment: boolean | null;
  attachment_type: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
}

const AdminBulletin: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachmentType, setAttachmentType] = useState<"none" | "link" | "image" | "pdf">("none");
  const [linkUrl, setLinkUrl] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bulletinItems = [], isLoading } = useQuery({
    queryKey: ['bulletinItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bulletin_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BulletinItem[] || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: { 
      title: string;
      content: string;
      has_attachment: boolean;
      attachment_type: string | null;
      attachment_url: string | null;
      attachment_name: string | null;
    }) => {
      const { data, error } = await supabase
        .from('bulletin_items')
        .insert([newItem])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulletinItems'] });
      resetForm();
      toast({
        title: "Success",
        description: "Announcement added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add announcement",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: itemData } = await supabase
        .from('bulletin_items')
        .select('has_attachment, attachment_url')
        .eq('id', id)
        .single();
      
      const typedItemData = itemData as BulletinItem;
      
      if (typedItemData?.has_attachment && typedItemData.attachment_url && 
          (typedItemData.attachment_url.includes('announcement_attachments'))) {
        const path = typedItemData.attachment_url.split('/').pop();
        if (path) {
          const { error: storageError } = await supabase.storage
            .from('announcement_attachments')
            .remove([path]);
          
          if (storageError) {
            console.error('Error deleting file from storage:', storageError);
          }
        }
      }
      
      const { error } = await supabase
        .from('bulletin_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulletinItems'] });
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete announcement",
        variant: "destructive",
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileToUpload(file);
      setAttachmentName(file.name);
    }
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!fileToUpload) return null;
    
    setIsUploading(true);
    try {
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('announcement_attachments')
        .upload(fileName, fileToUpload);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('announcement_attachments')
        .getPublicUrl(data.path);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setAttachmentType("none");
    setLinkUrl("");
    setAttachmentName("");
    setFileToUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    const newAnnouncement = {
      title,
      content,
      has_attachment: attachmentType !== "none",
      attachment_type: attachmentType === "none" ? null : attachmentType,
      attachment_url: null,
      attachment_name: attachmentType === "none" ? null : attachmentName || null,
    };

    try {
      if (attachmentType === "link") {
        if (!linkUrl) {
          toast({
            title: "Error",
            description: "Please enter a valid URL",
            variant: "destructive",
          });
          return;
        }
        newAnnouncement.attachment_url = linkUrl;
      }
      
      if ((attachmentType === "image" || attachmentType === "pdf") && fileToUpload) {
        const fileUrl = await uploadFile();
        if (!fileUrl) {
          return;
        }
        newAnnouncement.attachment_url = fileUrl;
      }

      createMutation.mutate(newAnnouncement);
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete);
    }
  };

  const getAttachmentIcon = (type: string | null) => {
    switch (type) {
      case 'link': return <Link className="h-4 w-4 text-blue-500" />;
      case 'image': return <Image className="h-4 w-4 text-green-500" />;
      case 'pdf': return <File className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Announcements</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Announcement</CardTitle>
          <CardDescription>Create a new announcement for the information bulletin</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="title" className="block mb-2 text-sm font-medium">Title</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement title"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block mb-2 text-sm font-medium">Content</label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Announcement details"
                rows={4}
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Attachment Type</label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  type="button" 
                  variant={attachmentType === "none" ? "default" : "outline"}
                  onClick={() => setAttachmentType("none")}
                  className="flex-1"
                >
                  None
                </Button>
                <Button 
                  type="button" 
                  variant={attachmentType === "link" ? "default" : "outline"}
                  onClick={() => setAttachmentType("link")}
                  className="flex-1"
                >
                  <Link className="mr-2 h-4 w-4" />
                  Link
                </Button>
                <Button 
                  type="button" 
                  variant={attachmentType === "image" ? "default" : "outline"}
                  onClick={() => setAttachmentType("image")}
                  className="flex-1"
                >
                  <Image className="mr-2 h-4 w-4" />
                  Image
                </Button>
                <Button 
                  type="button" 
                  variant={attachmentType === "pdf" ? "default" : "outline"}
                  onClick={() => setAttachmentType("pdf")}
                  className="flex-1"
                >
                  <File className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </div>
            </div>
            
            {attachmentType === "link" && (
              <div>
                <label htmlFor="linkUrl" className="block mb-2 text-sm font-medium">Link URL</label>
                <Input
                  id="linkUrl"
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                />
                <label htmlFor="linkName" className="block mt-2 mb-2 text-sm font-medium">Link Name (Optional)</label>
                <Input
                  id="linkName"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  placeholder="Name to display for link"
                />
              </div>
            )}
            
            {(attachmentType === "image" || attachmentType === "pdf") && (
              <div>
                <label htmlFor="fileUpload" className="block mb-2 text-sm font-medium">
                  {attachmentType === "image" ? "Upload Image" : "Upload PDF"}
                </label>
                <Input
                  id="fileUpload"
                  type="file"
                  accept={attachmentType === "image" ? "image/*" : "application/pdf"}
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  required
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || isUploading}
              className="w-full"
            >
              {(createMutation.isPending || isUploading) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploading ? "Uploading..." : "Adding..."}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Announcement
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Current Announcements</h2>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : bulletinItems.length === 0 ? (
        <Card className="p-6 text-center bg-muted/50">
          <p>No announcements have been added yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {bulletinItems.map((item: BulletinItem) => (
            <Card key={item.id} className="relative group">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {new Date(item.created_at).toLocaleString()}
                    </CardDescription>
                  </div>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDeleteClick(item.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">{item.content}</p>
                
                {item.has_attachment && item.attachment_url && (
                  <div className="mt-3 flex items-center p-2 bg-muted rounded-md">
                    {getAttachmentIcon(item.attachment_type)}
                    <span className="ml-2 text-sm">
                      {item.attachment_type === 'link' ? (
                        <a 
                          href={item.attachment_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          {item.attachment_name || 'View Link'} 
                          <Link className="h-3 w-3 ml-1" />
                        </a>
                      ) : item.attachment_type === 'image' ? (
                        <a 
                          href={item.attachment_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {item.attachment_name || 'View Image'}
                        </a>
                      ) : item.attachment_type === 'pdf' ? (
                        <a 
                          href={item.attachment_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {item.attachment_name || 'View PDF'}
                        </a>
                      ) : (
                        <span>{item.attachment_name || 'Attachment'}</span>
                      )}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBulletin;
