import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SongForm from "@/app/(dashboard)/dashboard/new_song/song-form";
import SongLinksForm from "@/app/(dashboard)/dashboard/edit/[song]/song-links-form";

export default async function SongEditPage({ params }: { params: Promise<{ song: string }> }) {
    const song = (await params).song
    const supabase = await createClient();

    // Get session data
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('songs_data')
        .select('*')
        .eq("id", song)
        .single();

    if (error) return <p className="text-red-500">Failed to fetch songs: { error.message }</p>;

    const { data: linkData, error: linkError } = await supabase
        .from('song_links')
        .select('*')
        .eq("song_id", song);

    if (linkError) return <p className="text-red-500">Failed to fetch song links: { linkError.message }</p>;


    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Song Details</CardTitle>
                    <CardDescription>
                        Edit song details here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SongForm song={ data } edit={ true }/>
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
                    <SongLinksForm songId={ song } existingLinks={ linkData } />
                </CardContent>
            </Card>
        </div>
    );
}