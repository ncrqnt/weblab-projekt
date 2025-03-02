// 'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Song, SongItem } from "@/app/(dashboard)/dashboard/song";
// import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function SongsTable({ page, owned = false }: {
    page: number;
    owned: boolean;
}) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    // const router = useRouter();
    const limit = 5;
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    let query = supabase.from('songs').select(`
    id,
    cover_image,
    title,
    album,
    created_by (user_name),
    created_at,
    songs_artists (artists (name))
    `,
        { count: "exact" }
    ).range(start, end).order("created_at", { ascending: false });

    if (owned) {
        query = query.eq("created_by", user.data.user?.id);
    }

    const { data, error, count } = await query;

    if (error) {
        return ("There was an error fetching songs");
    }

    if (count === 0) {
        return ("No songs found.");
    }

    const songData = data || [];
    const totalSongs = count || 0;

    const songs: SongItem[] = songData.map(song => ({
        id: song.id,
        cover_image: song.cover_image,
        title: song.title,
        artists: song.songs_artists.map(sa => sa.artists.name),
        album: song.album,
        created_by: song.created_by.user_name,
        created_at: song.created_at
    }));

    function prevPage() {
        router.back();
    }

    function nextPage() {
        router.push(`/?offset=${ offset }`, { scroll: false });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Songs</CardTitle>
                <CardDescription>
                    Manage the song links you created.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Image</span>
                            </TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Artist</TableHead>
                            <TableHead className="hidden md:table-cell">Album</TableHead>
                            <TableHead className="hidden md:table-cell">Created by</TableHead>
                            <TableHead className="hidden md:table-cell">Created at</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { songs.map((song) => (
                            <Song key={ song.id } song={ song }/>
                        )) }
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <form className="flex items-center w-full justify-between">
                    <div className="text-xs text-muted-foreground">
                        Showing{' '}
                        <strong>
                            {start+1}-{end > totalSongs ? totalSongs : end+1}
                        </strong>{' '}
                        of <strong>{totalSongs}</strong> products
                    </div>
                    <div className="flex">
                        <Button
                            formAction=""
                            variant="ghost"
                            size="sm"
                            type="submit"
                            disabled={start === 0}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Prev
                        </Button>
                        <Button
                            formAction=""
                            variant="ghost"
                            size="sm"
                            type="submit"
                            disabled={end+1 >= totalSongs}
                        >
                            Next
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </CardFooter>
        </Card>
    )
}