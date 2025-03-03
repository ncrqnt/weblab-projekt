'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Song } from "@/app/(dashboard)/dashboard/song";
import { DashboardTabs, SongItem, SongsTableProps } from "@/lib/types";

let navHistory: string[] = ["/dashboard"];

export function SongsTable({ data, tab }: {
    data: SongsTableProps;
    tab: DashboardTabs;
}) {
    let count: number = data.totalSongs;
    let songsData: SongItem[] = data.songs;

    if (tab === DashboardTabs.OWNED) {
        songsData = data.songs.filter(song => song.created_by === data.user);
        count = data.totalOwned;
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
                            <TableHead className="hidden md:table-cell">Created&nbsp;by</TableHead>
                            <TableHead className="hidden md:table-cell">Created&nbsp;at</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { songsData.map((song) => (
                            <Song key={ song.id } song={ song }/>
                        )) }
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing { ' ' } <strong>{ count }</strong> songs
                </div>
            </CardFooter>
        </Card>
    )
}