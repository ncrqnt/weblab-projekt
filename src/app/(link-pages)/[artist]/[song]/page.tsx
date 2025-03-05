import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { platforms } from "@/lib/platforms";

export default async function SongPage({ params }: { params: Promise<{ artist: string, song: string }> }) {
    const { artist, song } = await params;
    const supabase = await createClient();

    const platformOptions = platforms;

    const {
        data: artistData,
        error: artistError
    } = await supabase.from('artists').select('id').eq('slug', artist).single();

    if (artistError) return <p className="text-red-500">Failed to fetch data: { artistError.message }</p>;

    const { data: idData, error: idError } = await supabase
        .from("songs_artists")
        .select("song_id")
        .eq("artist_id", artistData.id)
        .eq("song_slug", song)
        .single();

    if (idError) return <p className="text-red-500">Failed to fetch data: { idError.message }</p>;

    const { data: songData, error: songError } = await supabase
        .from('songs_display')
        .select('title, album, release_date, cover_image, artists')
        .eq("id", idData.song_id)
        .single();

    if (songError) return <p className="text-red-500">Failed to fetch song data: { songError.message }</p>;

    const { data: linkData, error: linkError } = await supabase
        .from('song_links')
        .select('platform_name, url')
        .eq("song_id", idData.song_id)
        .order('platform_name');

    if (linkError) return <p className="text-red-500">Failed to fetch song links: { linkError.message }</p>;


    return (
        <div className="flex-1 w-full flex flex-col items-center bg-background justify-center">
            <Card>
                <CardHeader>
                    <Image
                        src={ songData.cover_image || "/placeholder_music.png" }
                        alt={ `Cover image of ${ songData.title }` }
                        width="200"
                        height="200"
                        className="mb-5 rounded-2xl mx-auto sm:h-[250px] sm:w-[250px] border-[1px] dark:border-0"
                    />
                    <CardTitle className="text-center text-2xl sm:text-3xl font-bold">{ songData.title }</CardTitle>

                    <div className="flex justify-center gap-3 mt-2">
                        { songData.artists.map((artist: { name: string, slug: string }) => (
                            <Link
                                key={ artist.slug }
                                href={ `/${ artist.slug }` }
                                className="font-bold dark:text-gray-400 hover:underline text-sm sm:text-lg text-center"
                            >
                                { artist.name }
                            </Link>
                        )) }
                    </div>

                    <div className="flex justify-center items-center gap-2 mt-3 dark:text-gray-400 text-sm sm:text-md">
                        { songData.album && <p className="italic">{ songData.album }</p> }
                        { songData.release_date && (
                            <>
                                <p>•</p>
                                <p>
                                    { format(new Date(songData.release_date), "dd.MM.yyyy") }
                                </p>
                            </>
                        ) }
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center w-full gap-2">
                    { linkData.map((link) => {
                        const platform = platformOptions.find(p => p.value === link.platform_name);
                        return (
                            <Button
                                key={ link.platform_name }
                                variant={ "outline" }
                                className="flex justify-start w-full gap-3 px-4 py-4 sm:py-6 text-md sm:text-xl dark:text-gray-400 dark:hover:text-white"
                                size={ "lg" }
                                asChild
                            >
                                <Link href={ link.url } target="_blank" rel="noopener noreferrer">
                                    { platform?.icon &&
                                        <Image src={ platform.icon } alt={ platform.label } height={ 24 } width={ 24 }
                                               className="dark:invert sm:h-[32px] sm:w-[32px]"/> }
                                    { platform?.label || link.platform_name }
                                </Link>
                            </Button>
                        );
                    }) }
                </CardContent>
            </Card>
        </div>
    );
}