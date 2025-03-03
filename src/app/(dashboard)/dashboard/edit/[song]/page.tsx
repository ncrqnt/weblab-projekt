import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SongForm from "@/app/(dashboard)/dashboard/new_song/song-form";

export default async function SongEditPage({ params }: { params: Promise<{ song: string }> }) {
    const song = (await params).song
    const supabase = await createClient();

    // Check login
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    const { data, error } = await supabase
        .from('songs_data')
        .select('*')
        .eq("id", song)
        .single();

    if (error) return <p className="text-red-500">Failed to songs: { error.message }</p>;


    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Song Details</CardTitle>
                    <CardDescription>
                        Edit song details here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SongForm song={data} edit={true} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Song Links</CardTitle>
                    <CardDescription>
                        Add or delete song links here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                </CardContent>
            </Card>
        </>
    );
}