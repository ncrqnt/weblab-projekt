'use client';

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArtistItem } from "@/lib/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Artist } from "@/app/(dashboard)/dashboard/artists/artist";
import ArtistForm from "@/app/(dashboard)/dashboard/artists/artist-form";

export function ArtistsTable({ artists, currentUser }: {
    artists: ArtistItem[],
    currentUser: { id: string, user_name: string, role: string }
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="flex items-center mb-2">
                <div className="ml-auto flex items-center gap-2">
                    <Dialog open={ open } onOpenChange={ setOpen }>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-8 gap-1" asChild>
                                <Link href="#"><PlusCircle className="h-3.5 w-3.5"/>Add Artist</Link>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add new artist</DialogTitle>
                                <DialogDescription>
                                    Create a new artist.
                                </DialogDescription>
                            </DialogHeader>
                            <ArtistForm edit={ false } />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Artists</CardTitle>
                    <CardDescription>List of all artists</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                    <span className="sr-only">Image</span>
                                </TableHead>
                                <TableHead>Artist</TableHead>
                                <TableHead className="hidden md:table-cell">Created&nbsp;by</TableHead>
                                <TableHead className="hidden md:table-cell">Created&nbsp;at</TableHead>
                                <TableHead className="w-fit">
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { artists.map((artist) => (
                                <Artist key={ artist.id } artist={ artist } currentUser={ currentUser.id }/>
                            )) }
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Showing { ' ' } <strong>{ artists.length }</strong> users
                    </div>
                </CardFooter>
            </Card>
        </>
    )
}