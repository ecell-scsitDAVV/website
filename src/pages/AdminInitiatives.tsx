import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ImageUploader from "@/components/ImageUploader";

interface Initiative {
    id: string;
    title: string;
    description: string;
    images: string[];
}

export default function AdminInitiatives() {
    const [initiatives, setInitiatives] = useState<Initiative[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [current, setCurrent] = useState<Initiative | null>(null);

    // Form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState("");

    // Fetch initiatives
    const fetchInitiatives = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("initiatives").select("*");
        if (!error) setInitiatives(data as Initiative[]);
        setLoading(false);
    };

    useEffect(() => {
        fetchInitiatives();
    }, []);

    // Open modal
    const openModal = (item?: Initiative) => {
        if (item) {
            setCurrent(item);
            setTitle(item.title);
            setDescription(item.description);
            setImages(item.images.join(","));
        } else {
            setCurrent(null);
            setTitle("");
            setDescription("");
            setImages("");
        }
        setIsModalOpen(true);
    };

    // Create / Update
    const saveInitiative = async () => {
        const payload = {
            title,
            description,
            images: images.split(",").map((s) => s.trim()),
        };

        if (current) {
            await supabase.from("initiatives").update(payload).eq("id", current.id);
        } else {
            await supabase.from("initiatives").insert([payload]);
        }

        setIsModalOpen(false);
        fetchInitiatives();
    };

    // Delete
    const deleteInitiative = async (id: string) => {
        const ok = confirm("Are you sure?");
        if (!ok) return;
        await supabase.from("initiatives").delete().eq("id", id);
        fetchInitiatives();
    };

    if (loading)
        return <div className="p-6 text-center text-gray-600 animate-pulse">Loading...</div>;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-background bg-clip-text">
                    Initiatives Admin Panel
                </h1>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                >
                    + Add Initiative
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl shadow-lg border bg-background backdrop-blur-lg">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-100/80">
                        <tr>
                            <th className="p-4 text-left font-semibold">Title</th>
                            <th className="p-4 text-left font-semibold">Description</th>
                            <th className="p-4 text-left font-semibold">Images</th>
                            <th className="p-4 text-center font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initiatives.map((item, index) => (
                            <tr
                                key={item.id}
                                className={`transition-all hover:bg-gray-50`}
                            >
                                <td className="p-4 font-medium">{item.title}</td>
                                <td className="p-4 text-gray-600">{item.description}</td>
                                <td className="p-4">
                                    <img
                                        src={item.images[0]}
                                        className="h-20 w-32 object-cover rounded-lg shadow-sm border"
                                    />
                                </td>
                                <td className="p-4 flex gap-3 justify-center">
                                    <button
                                        onClick={() => openModal(item)}
                                        className="px-4 py-1.5 text-sm bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition shadow"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteInitiative(item.id)}
                                        className="px-4 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full animate-fadeIn">
                        <h2 className="text-2xl font-bold mb-4">
                            {current ? "Edit Initiative" : "Add Initiative"}
                        </h2>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <textarea
                                placeholder="Description"
                                className="w-full px-4 py-2 border rounded-xl h-28 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            <ImageUploader
                                onUpload={(url) =>
                                    setImages((prev) =>
                                        prev ? `${prev},${url}` : url
                                    )
                                }
                            />

                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
                                onClick={saveInitiative}
                            >
                                {current ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
