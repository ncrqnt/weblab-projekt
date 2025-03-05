import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ArtistForm from "@/app/(dashboard)/dashboard/artists/artist-form";
import ArtistLinksForm from "@/app/(dashboard)/dashboard/artists/[artist]/artist-links-form";

export default async function SongEditPage({ params }: { params: Promise<{ artist: string }> }) {
    const artist = (await params).artist
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('artists_data')
        .select('*')
        .eq("id", artist)
        .single();

    if (error) return <p className="text-red-500">Failed to fetch songs: { error.message }</p>;

    const { data: linkData, error: linkError } = await supabase
        .from('artist_links')
        .select('*')
        .eq("artist_id", artist);

    if (linkError) return <p className="text-red-500">Failed to fetch song links: { linkError.message }</p>;


    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Song Details</CardTitle>
                    <CardDescription>
                        Edit artist details here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ArtistForm artist={data} edit={true} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Artist Links</CardTitle>
                    <CardDescription>
                        Add or delete artist links here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ArtistLinksForm artistId={artist} existingLinks={linkData} />
                </CardContent>
            </Card>
        </div>
    );
}