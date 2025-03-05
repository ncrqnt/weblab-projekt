'use client';

import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { generateSlug } from "@/utils/utils";
import { SongItem } from "@/lib/types";
import { useUserId } from "@/hooks/useUserId";

const optionSchema = z.object({
    label: z.string(),
    value: z.string(),
    disable: z.boolean().optional(),
});

const songSchema = z.object({
    title: z.string().min(1, "Title is required"),
    album: z.string().optional(),
    release_date: z.date().optional(),
    cover_image: z.union([z.literal(""), z.string().trim().url("Invalid URL")]),
    artists: z.array(optionSchema).min(1, "At least one artist is required"),
});

export default function SongForm({ song, edit = false }: { song?: SongItem, edit?: boolean }) {
    const supabase = createClient();
    const router = useRouter();
    const [artists, setArtists] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const { userId, loading: userLoading } = useUserId();

    const getArtists = useCallback(async () => {
        try {
            setLoading(true);

            const {
                data,
                error
            } = await supabase.from("artists").select("id, name").order("name", { ascending: true });

            if (error) throw error;

            if (JSON.stringify(data) !== JSON.stringify(artists)) {
                setArtists(data ?? []);
            }
        } catch (error) {
            toast.error("Failed to fetch artists");
        } finally {
            setLoading(false);
        }
    }, [supabase, artists]);

    useEffect(() => {
        if (!userLoading) {
            setLoading(false);
        }
    }, [userLoading]);

    useEffect(() => {
        void getArtists();
    }, []);

    const artistOptions: Option[] = useMemo(() =>
            artists.map(artist => ({
                label: artist.name,
                value: artist.id,
            })),
        [artists]);

    const form = useForm({
        resolver: zodResolver(songSchema),
        defaultValues: {
            title: song?.title || "",
            album: song?.album || "",
            release_date: song?.release_date ? new Date(song.release_date) : undefined,
            cover_image: song?.cover_image || "",
            artists: song?.artists.map((artist: { name: string; id: string; slug: string }) => ({
                label: artist.name,
                value: artist.id
            })),
        },
    });

    async function onSubmit(values: z.infer<typeof songSchema>) {
        try {
            setLoading(true);
            if (!userId) throw new Error("User not authenticated!");

            if (edit && song && (userId != song.created_by.id)) throw new Error("User is not allowed to edit this item");

            let artistIds = [];
            for (const artist of values.artists) {
                if (artist.label === artist.value) {
                    // Insert new artist
                    const { data, error } = await supabase.from("artists").insert([{
                        name: artist.label,
                        slug: generateSlug(artist.label),
                        created_by: userId
                    }]).select("id").single();
                    if (error) throw new Error("Failed to add new artist");
                    artistIds.push(data.id);
                } else {
                    artistIds.push(artist.value);
                }
            }

            if (edit && song) {
                const { error: updateError } = await supabase
                    .from("songs")
                    .update({
                        title: values.title,
                        slug: generateSlug(values.title),
                        album: values.album || null,
                        release_date: values.release_date || null,
                        cover_image: values.cover_image || null
                    })
                    .eq("id", song.id);

                if (updateError) throw Error("Failed to update song");

                await supabase.from("songs_artists").delete().eq("song_id", song.id);

                const artistLinks = artistIds.map(
                    (artistId) => ({
                        song_id: song.id,
                        song_slug: generateSlug(values.title),
                        artist_id: artistId,
                    }));
                await supabase.from("songs_artists").insert(artistLinks);

                toast.success("Song updated successfully!");
                router.refresh();
            } else {
                const { data: songData, error: songError } = await supabase
                    .from("songs")
                    .insert({
                        title: values.title,
                        slug: generateSlug(values.title),
                        album: values.album || null,
                        release_date: values.release_date || null,
                        cover_image: values.cover_image || null,
                        created_by: userId
                    })
                    .select("id,title")
                    .single();

                if (songError) throw new Error("Failed to create song");

                const artistLinks = artistIds.map(
                    (artistId) => ({
                        song_id: songData.id,
                        song_slug: generateSlug(songData.title),
                        artist_id: artistId,
                    }));
                await supabase.from("songs_artists").insert(artistLinks);

                router.push("/dashboard");
                toast.success("Song added successfully");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form { ...form }>
            <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-4">
                {/* Song Title */ }
                <FormField
                    control={ form.control }
                    name="title"
                    render={ ({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Song Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter song title"
                                    disabled={ loading }
                                    { ...field }
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    ) }
                />

                {/* Album (Optional) */ }
                <FormField
                    control={ form.control }
                    name="album"
                    render={ ({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Album (optional)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Album name"
                                    disabled={ loading }
                                    { ...field }
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    ) }
                />

                {/* Cover Image URL (Optional) */ }
                <FormField
                    control={ form.control }
                    name="cover_image"
                    render={ ({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Cover Image URL (optional)</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={ loading }
                                    placeholder="https://..."
                                    { ...field }
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    ) }
                />

                {/* Release Date (Optional) */ }
                <FormField
                    control={ form.control }
                    name="release_date"
                    render={ ({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Release Date (optional)</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={ "outline" }
                                            disabled={ loading }
                                            className={ cn(
                                                "w-full h-10 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            ) }
                                        >
                                            { field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            ) }
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={ field.value ? new Date(field.value.toISOString().split("T")[0] + "T00:00:00Z") : undefined }
                                        onSelect={ (date) => field.onChange(date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) : undefined) }
                                        disabled={ (date) => date > new Date() || date < new Date("1900-01-01") }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage/>
                        </FormItem>
                    ) }
                />

                {/* Artist Selection */ }
                <FormField
                    control={ form.control }
                    name="artists"
                    render={ ({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Artists</FormLabel>

                            <MultipleSelector
                                { ...field }
                                key={ artistOptions.length }
                                disabled={ loading }
                                className="h-10"
                                defaultOptions={ loading ? [] : artistOptions }
                                placeholder={ loading ? "Fetching artists...." : "Type in the artist(s)..." }
                                creatable
                                emptyIndicator={
                                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                        { loading ? "Fetching artists..." : "No results found." }
                                    </p>
                                }
                            />
                            <FormMessage/>
                        </FormItem>
                    ) }
                />

                {/* Submit Button */ }
                <Button disabled={ loading } type="submit" className="w-full">
                    { song ? "Save" : "Submit" }
                </Button>
            </form>
        </Form>
    );

}