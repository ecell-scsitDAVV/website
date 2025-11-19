import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ExternalLink, Image, File, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

interface BulletinItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  attachment_type: string | null;
  attachment_url: string | null;
}

const InfoBulletin: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["bulletinItems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bulletin_items")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return [];
      return data as BulletinItem[];
    },
  });

  const showItems = showAll ? items : items.slice(0, 2);

  const getIcon = (type: string | null) => {
    if (type === "link") return <ExternalLink className="w-4 h-4 text-blue-300" />;
    if (type === "image") return <Image className="w-4 h-4 text-green-300" />;
    if (type === "pdf") return <File className="w-4 h-4 text-red-300" />;
    return null;
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Section Heading */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-white">Latest Announcements</h2>

          <RouterLink to="/announcements">
            <Button variant="default" className="hover:bg-white/10">
              View All
            </Button>
          </RouterLink>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : (
          <AnimatePresence>
            {showItems.map((item: BulletinItem) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mb-3"
              >

                {/* Entire card clickable → /announcements */}
                <RouterLink to="/announcements" className="block rounded-lg">
                  <Card className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white/20 transition">
                    
                    {/* Announcement Title */}
                    <div className="flex flex-col">
                      <p className="text-white font-medium truncate max-w-[400px]">
                        {item.title}
                      </p>
                      <span className="text-sm text-gray-300">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Attachment Icon */}
                    {item.attachment_url && (
                      <span className="ml-4 p-2 rounded-md bg-white/10 hover:bg-white/20 transition">
                        {getIcon(item.attachment_type)}
                      </span>
                    )}
                  </Card>
                </RouterLink>

              </motion.div>
            ))}
          </AnimatePresence>
        )}

      </div>
    </section>
  );
};

export default InfoBulletin;
