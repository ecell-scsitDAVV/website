import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2, File, ExternalLink, Image } from "lucide-react";

const Announcements: React.FC = () => {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["allAnnouncements"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bulletin_items")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const getIcon = (t: string | null) =>
    t === "pdf" ? <File className="w-4 h-4" /> :
    t === "image" ? <Image className="w-4 h-4" /> :
    t === "link" ? <ExternalLink className="w-4 h-4" /> :
    null;

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-4xl text-white font-bold mb-8">All Announcements</h1>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      ) : (
        items.map((item: any) => (
          <Card key={item.id} className="mb-4 bg-white/10 backdrop-blur-lg border border-white/20 p-5">
            <h2 className="text-xl text-white">{item.title}</h2>
            <p className="text-gray-300 text-sm">
              {new Date(item.created_at).toLocaleString()}
            </p>
            <p className="text-gray-100 mt-2">{item.content}</p>

            {item.attachment_url && (
              <a
                href={item.attachment_url}
                target="_blank"
                className="mt-4 inline-flex items-center gap-2 text-blue-300 hover:underline"
              >
                {getIcon(item.attachment_type)}
                Open Attachment
              </a>
            )}
          </Card>
        ))
      )}
    </div>
  );
};

export default Announcements;
