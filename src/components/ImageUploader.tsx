import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  onUpload: (urls: string[]) => void;
}

export default function MultiImageUploader({ onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);

      const ext = file.name.split(".").pop();
      const fileName = `initiative_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("initiative-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("initiative-images")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFiles = async (files: FileList) => {
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }

    const newImages = [...images, ...urls];
    setImages(newImages);
    onUpload(newImages);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const removeImage = (url: string) => {
    const filtered = images.filter((img) => img !== url);
    setImages(filtered);
    onUpload(filtered);
  };

  return (
    <div className="space-y-4">
      {/* Uploaded Images Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url) => (
            <div key={url} className="relative group">
              <img
                src={url}
                className="w-full h-32 object-cover rounded-xl border shadow"
              />
              <button
                onClick={() => removeImage(url)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <p className="text-gray-600 mb-2">
          Drag & Drop Images or Click to Upload
        </p>
        <label
          htmlFor="multiImages"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          {uploading ? "Uploading..." : "Select Images"}
        </label>
        <input
          id="multiImages"
          type="file"
          accept="image/*"
          className="hidden"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
