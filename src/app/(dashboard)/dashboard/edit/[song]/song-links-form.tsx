'use client';

import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Save, Trash2 } from "lucide-react";
import { useUserId } from "@/hooks/useUserId";
import { platforms } from "@/lib/platforms";

interface SongLink {
    id: string;
    song_id: string;
    platform_name: string;
    url: string;
}

const songLinkSchema = z.object({
    platform_name: z.enum(["spotify", "apple_music", "youtube", "youtube_music", "amazon_music", "tidal", "deezer"]),
    url: z.string().trim().url("Invalid URL"),
});

export default function SongLinksForm({ songId, existingLinks }: { songId: string, existingLinks: any[] }) {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState(existingLinks || []);
    const [newLinks, setNewLinks] = useState<any[]>([]);
    const [editedLinks, setEditedLinks] = useState<Record<string, Partial<SongLink>>>({});
    const [usedPlatforms, setUsedPlatforms] = useState<string[]>(existingLinks.map(link => link.platform_name));
    const { userId, loading: userLoading } = useUserId();


    const platformOptions = platforms;

    useEffect(() => {
        if (!userLoading) {
            setLoading(false);
        }
    }, [userLoading]);

    useEffect(() => {
        setUsedPlatforms(links.map(link => link.platform_name));
    }, [links]);

    const form = useForm({
        resolver: zodResolver(songLinkSchema),
        defaultValues: {
            platform_name: undefined,
            url: "",
        },
    });

    function handleEdit(linkId: string, field: keyof SongLink, value: string) {
        setEditedLinks(prev => ({
            ...prev,
            [linkId]: { ...prev[linkId], [field]: value },
        }));
        setLinks(links.map(link => (link.id === linkId ? { ...link, [field]: value } : link)));
    }

    async function handleSave(link: SongLink, isNew = false) {
        try {
            setLoading(true);

            if (!userId) throw new Error("User not authenticated");

            if (!link.url || !link.platform_name) {
                throw new Error("Please select a platform and enter a valid URL.");
            }

            if (isNew) {
                const { data, error } = await supabase
                    .from("song_links")
                    .insert({
                        song_id: songId,
                        platform_name: link.platform_name,
                        url: link.url,
                    })
                    .select("*")
                    .single();

                if (error) throw new Error("Failed to add link.");
                setLinks([...links, data]);
                setNewLinks(newLinks.filter(nl => nl !== link));
                setUsedPlatforms([...usedPlatforms, data.platform_name]);
            } else {
                const updatedLink = editedLinks[link.id];
                if (!updatedLink) return;

                const { error } = await supabase
                    .from("song_links")
                    .update({ url: updatedLink.url })
                    .eq("id", link.id);

                if (error) throw new Error("Failed to update link.");
                setEditedLinks(prev => {
                    const newState = { ...prev };
                    delete newState[link.id];
                    return newState;
                });
            }

            toast.success("Song link saved!");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(linkId: string, isNew = false) {
        try {
            setLoading(true);
            if (isNew) {
                setNewLinks(newLinks.filter(link => link.id !== linkId));
            } else {
                const { error } = await supabase.from("song_links").delete().eq("id", linkId);
                if (error) throw new Error("Failed to delete link.");
                setLinks(links.filter(link => link.id !== linkId));
                setUsedPlatforms(usedPlatforms.filter(platform => platform !== links.find(l => l.id === linkId)?.platform_name));
            }
            toast.success("Song link deleted!");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    function addNewLink() {
        setNewLinks([...newLinks, { id: Date.now().toString(), song_id: songId, platform_name: "", url: "" }]);
    }

    return (
        <div className="space-y-6">
            {/* ✅ Existing Links */}
            {links.map((link) => {
                const isEdited = !!editedLinks[link.id];
                return (
                    <div key={ link.id } className="flex items-center gap-3 p-3 border rounded-lg">
                        <img className="h-6 w-6 dark:invert"
                             src={ platformOptions.find(p => p.value === link.platform_name)?.icon }
                             alt={ `${ platformOptions.find(p => p.value === link.platform_name)?.label } icon` }/>
                        <Input
                            value={editedLinks[link.id]?.url ?? link.url}
                            onChange={e => handleEdit(link.id, "url", e.target.value)}
                            className="flex-1"
                        />
                        <Button variant="secondary" size="sm" disabled={!isEdited} onClick={() => handleSave(link)}>
                            <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(link.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )
            })}

            {/* ✅ New Link Rows */}
            {newLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {/* Platform Selector */}
                    <Select
                        onValueChange={(value) => setNewLinks(newLinks.map(nl => nl.id === link.id ? { ...nl, platform_name: value } : nl))}
                        defaultValue={link.platform_name}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                        <SelectContent>
                            {platformOptions
                                .filter(option => !usedPlatforms.includes(option.value))
                                .map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>

                    {/* URL Input */}
                    <Input
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => setNewLinks(newLinks.map(nl => nl.id === link.id ? { ...nl, url: e.target.value } : nl))}
                        className="w-3/4"
                    />

                    {/* Save Button */}
                    <Button variant="secondary" size="sm" disabled={loading} onClick={() => handleSave(link, true)}>
                        <Save className="h-4 w-4"/>
                    </Button>

                    {/* Delete Button */}
                    <Button variant="destructive" size="sm" disabled={loading} onClick={() => handleDelete(link.id, true)}>
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </div>
            ))}

            {/* ✅ Add New Link Button */}
            <Button variant="outline" size="sm" onClick={addNewLink} disabled={newLinks.length + links.length >= platformOptions.length}>
                <PlusCircle className="h-4 w-4 mr-2"/> Add Link
            </Button>
        </div>
    );

}