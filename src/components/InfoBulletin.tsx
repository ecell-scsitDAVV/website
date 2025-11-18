import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Link, Image, File, ExternalLink, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
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
const InfoBulletin: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const {
    data: bulletinItems = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['bulletinItems'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('bulletin_items').select('*').order('created_at', {
        ascending: false
      });
      if (error) {
        console.error("Error fetching bulletin items:", error);
        return [];
      }
      return data as BulletinItem[] || [];
    }
  });

  // Fallback data in case of error or empty data
  const hasBulletinItems = bulletinItems && bulletinItems.length > 0;

  // Display only 2 items if not showing all
  const displayItems = showAll ? bulletinItems : bulletinItems.slice(0, 2);
  const getAttachmentIcon = (type: string | null) => {
    switch (type) {
      case 'link':
        return <ExternalLink className="h-4 w-4 text-blue-300" />;
      case 'image':
        return <Image className="h-4 w-4 text-green-300" />;
      case 'pdf':
        return <File className="h-4 w-4 text-red-300" />;
      default:
        return null;
    }
  };
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };
  return <section className="py-12 px-4 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Latest Announcements</h2>
          {hasBulletinItems && bulletinItems.length > 2 && <Button onClick={toggleShowAll} variant="outline" className="text-white border-white bg-slate-500 hover:bg-slate-400">
              {showAll ? 'Show Less' : 'See All'} 
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>}
        </div>
        
        {isLoading ? <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div> : <AnimatePresence>
            <motion.div key={showAll ? 'all' : 'limited'} initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 0.3
        }}>
              <ScrollArea className={`${showAll ? 'h-[600px]' : 'h-auto'} pr-4`}>
                <div className="grid gap-4">
                  {hasBulletinItems ? displayItems.map((item: BulletinItem) => <Card key={item.id} className="overflow-hidden border border-primary/10 bg-white/10 backdrop-blur-lg shadow-lg">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl text-blue-300">{item.title}</CardTitle>
                          <CardDescription className="text-sm text-sky-200">
                            {new Date(item.created_at).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-100 mb-3">{item.content}</p>
                          
                          {item.has_attachment && item.attachment_url && <div className="mt-3 flex items-center p-2 bg-white/5 rounded-md border border-white/10">
                              {getAttachmentIcon(item.attachment_type)}
                              <span className="ml-2 text-sm">
                                {item.attachment_type === 'link' ? <a href={item.attachment_url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 hover:underline flex items-center">
                                    {item.attachment_name || 'View Link'} 
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </a> : item.attachment_type === 'image' ? <a href={item.attachment_url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 hover:underline">
                                    {item.attachment_name || 'View Image'}
                                  </a> : item.attachment_type === 'pdf' ? <a href={item.attachment_url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 hover:underline">
                                    {item.attachment_name || 'View PDF'}
                                  </a> : <span className="text-blue-300">{item.attachment_name || 'Attachment'}</span>}
                              </span>
                            </div>}
                        </CardContent>
                      </Card>) : <Card className="p-6 text-center bg-white/10 backdrop-blur-lg">
                      <p className="text-white">No announcements at this time.</p>
                    </Card>}
                </div>
              </ScrollArea>
            </motion.div>
          </AnimatePresence>}
      </div>
    </section>;
};
export default InfoBulletin;