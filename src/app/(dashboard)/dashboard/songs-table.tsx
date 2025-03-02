'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Song } from "@/app/(dashboard)/dashboard/song";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DashboardTabs, SongItem, SongsTableProps } from "@/lib/types";
import { useEffect } from "react";

let navHistory: string[] = ["/dashboard"];

export function SongsTable({ data, tab }: {
    data: SongsTableProps;
    tab: DashboardTabs;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const page: number = Number(searchParams.get("page")) || 1;
    const limit: number = Number(searchParams.get("limit") || 5);

    const router = useRouter();
    const start = (+page - 1) * +limit;
    const end = +start + +limit - 1;
    let count = data.totalSongs;
    let songsData: SongItem[];

    if (tab === DashboardTabs.OWNED) {
        songsData = data.songs.filter(song => song.created_by === data.user);
        count = songsData.length;
    }
    else {
        songsData = data.songs;
    }

    function prevPage() {
        router.back();
    }

    function nextPage() {
        let nextPage = +page + 1;
        let newPath = `${pathname}?page=${ nextPage }&limit=${ limit }`;

        if (navHistory[nextPage - 1] === newPath) {
            router.forward();
        }
        else {
            router.push(newPath, { scroll: false });
            navHistory.push(newPath);
        }
    }

    useEffect(() => {
        if (searchParams == null) {
            router.replace(`${pathname}`, { scroll: false });
        }
    }, [tab])

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
                        { songsData.map((song) => (
                            <Song key={ song.id } song={ song }/>
                        )) }
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <form className="flex items-center w-full justify-between">
                    <div className="text-xs text-muted-foreground">
                        Showing{ ' ' }
                        <strong>
                            { start + 1 }-{ +end > count ? count : +end + 1 }
                        </strong>{ ' ' }
                        of <strong>{ count }</strong> products
                    </div>
                    <div className="flex">
                        <Button
                            formAction={prevPage}
                            variant="ghost"
                            size="sm"
                            type="submit"
                            disabled={ start === 0 }
                        >
                            <ChevronLeft className="mr-2 h-4 w-4"/>
                            Prev
                        </Button>
                        <Button
                            formAction={nextPage}
                            variant="ghost"
                            size="sm"
                            type="submit"
                            disabled={ +end + 1 >= count }
                        >
                            Next
                            <ChevronRight className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                </form>
            </CardFooter>
        </Card>
    )
}