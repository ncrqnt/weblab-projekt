import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import { platforms } from "@/lib/platforms";

export default async function SongPage({ params }: { params: Promise<{ artist: string }> }) {
    const { artist } = await params;
    const supabase = await createClient();

    const platformOptions = platforms;

    const {
        data: artistData,
        error: artistError
    } = await supabase.from('artists').select('id, name').eq('slug', artist).single();
    if (artistError) return <p className="text-red-500">Failed to fetch artist: { artistError.message }</p>;

    const { data: songData, error: songError } = await supabase
        .from('songs_by_artists')
        .select('title, album, release_date, cover_image, song_slug')
        .eq('artist_id', artistData.id)
        .order('release_date', { ascending: false, nullsFirst: false })
        .order('title');

    if (songError) return <p className="text-red-500">Failed to fetch songs: { songError.message }</p>;


    const { data: linkData, error: linkError } = await supabase
        .from('artist_links')
        .select('platform_name, url')
        .eq('artist_id', artistData.id)
        .order('platform_name');

    if (linkError) return <p className="text-red-500">Failed to fetch artist links: { linkError.message }</p>;


    return (
        <>
            <header
                className="sticky top-0 w-full flex justify-center border-b border-b-foreground/10 h-32 bg-background z-50">
                <div className="w-full flex flex-col justify-center items-center p-3 px-5 gap-5">
                    <div className="text-3xl font-bold text-center">
                        { artistData.name }
                    </div>
                    <div className="flex flex-row items-center justify-center w-full gap-6">
                        { linkData.map((link) => {
                            const platform = platformOptions.find(p => p.value === link.platform_name);
                            return (
                                <Link href={ link.url } target="_blank" rel="noopener noreferrer">
                                    { platform?.icon &&
                                        <Image src={ platform.icon } alt={ platform.label } height={ 24 } width={ 24 }
                                               className="dark:invert"/> }
                                </Link>
                            );
                        }) }
                    </div>
                </div>
            </header>
            <div className="flex-1 w-full flex flex-col items-center bg-background my-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-sm sm:max-w-xl md:max-w-4xl lg:max-w-7xl px-6">
                    { songData.map((song) => (
                        <Card key={ song.song_slug }
                              className="rounded-lg shadow-md hover:shadow-lg transition h-full w-full">
                            <Link href={ `/${ artist }/${ song.song_slug }` } className="flex flex-col">
                                <div className="relative w-full">
                                    <Image
                                        src={ song.cover_image || '/placeholder_music.png' }
                                        alt={ song.title }
                                        width={ 500 }
                                        height={ 500 }
                                        className="rounded-t-lg object-cover w-full h-48"
                                    />
                                </div>
                                <CardHeader className="py-2">
                                    <CardTitle className="text-lg font-semibold">{ song.title }</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col text-sm pb-4">
                                    <p className="text-muted-foreground">{ song.album }</p>
                                    <p className="text-muted-foreground italic">
                                        { song.release_date
                                            ? format(new Date(song.release_date), "MMMM yyyy")
                                            : "Unknown Release Date" }
                                    </p>
                                </CardContent>
                            </Link>
                        </Card>
                    )) }
                </div>
            </div>
        </>
    );
}