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
import { ArtistItem } from "@/lib/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUserId } from "@/hooks/useUserId";
import { artistSchema } from "@/app/(dashboard)/dashboard/artists/schema";
import { generateSlug } from "@/utils/utils";

export default function ArtistForm({ artist, edit}: { artist?: ArtistItem, edit: boolean }) {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { userId, loading: userLoading } = useUserId();

    useEffect(() => {
        if (!userLoading) {
            setLoading(false);
        }
    }, [userLoading]);

    const form = useForm<z.infer<typeof artistSchema>>({
        resolver: zodResolver(artistSchema),
        defaultValues: {
            name: artist?.name || "",
            profilePicture: artist?.profile_picture || undefined,
        },
    });

    async function onSubmit(values: z.infer<typeof artistSchema>) {
        try {
            setLoading(true);
            if (!userId) throw new Error("User not authenticated!");
            const slug = generateSlug(values.name);

            if (edit && artist) {
                const { error } = await supabase.from('artists').update({
                    name: values.name,
                    slug: slug,
                    profile_picture: values.profilePicture,
                }).eq('id', artist.id);

                if (error) throw new Error(error.message);

                toast.success("Artist updated successfully!");
                router.refresh();
            }
            else {
                const { data, error } = await supabase.from('artists').insert({
                    name: values.name,
                    slug: slug,
                    profile_picture: values.profilePicture,
                    created_by: userId,
                }).select('id').single();

                if (error) throw new Error(error.message);

                toast.success("Artist created successfully!");
                router.push(`/dashboard/artists/${data.id}`);
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
                <FormField
                    control={ form.control }
                    name="name"
                    render={ ({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Artist Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter a name"
                                    disabled={ loading }
                                    { ...field }
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    ) }
                />

                <FormField
                    control={ form.control }
                    name="profilePicture"
                    render={ ({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Artist Image URL (optional)</FormLabel>
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

                <Button disabled={ loading } type="submit" className="w-full">
                    { edit ? "Save" : "Create" }
                </Button>
            </form>
        </Form>
    );

}