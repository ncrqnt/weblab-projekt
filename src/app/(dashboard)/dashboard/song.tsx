import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ExternalLink, MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { SongItem } from "@/lib/types";
import Link from "next/link";
import { deleteItem } from "@/app/(dashboard)/dashboard/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function deleteSong(id: string) {
    try {
        void deleteItem(id);
        toast.success("Song deleted successfully.");
    } catch (error: any) {
        toast.error("Failed to delete song.", error.message);
    }
}

export function Song({ song }: { song: SongItem }) {
    return (
        <TableRow>
            <TableCell className="hidden sm:table-cell">
                <Image
                    alt="Cover image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={ song.cover_image ?? '/placeholder_music.png' }
                    width="64"
                />
            </TableCell>
            <TableCell className="font-medium">{ song.title }</TableCell>
            <TableCell className="hidden md:table-cell">
                { song.artists.map((artist: { id: string, name: string }, index: number) => (
                    <Badge key={ index } variant="outline" className="capitalize text-center">
                        { artist.name }
                    </Badge>
                )) }
            </TableCell>
            <TableCell className="hidden md:table-cell">{ song.album }</TableCell>
            <TableCell className="hidden md:table-cell">{ song.created_by.name }</TableCell>
            <TableCell className="hidden md:table-cell">
                { song.created_at ? new Date(song.created_at).toLocaleDateString("de-CH", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                }) : 'N/A' }
            </TableCell>
            <TableCell className="text-right whitespace-nowrap">
                <AlertDialog>
                    <Tooltip>
                        <DropdownMenu>
                            <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4"/>
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Actions</TooltipContent>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href={ `/dashboard/edit/${ song.id }` } className="w-full">Edit</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <AlertDialogTrigger className="w-full">Delete</AlertDialogTrigger>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete '{ song.title }'</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the song from the server.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction variant="destructive"
                                                   onClick={ () => deleteSong(song.id) }>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </Tooltip>
                </AlertDialog>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button aria-haspopup="false" size="icon" variant="ghost">
                            <Link href={ `/${ song.artists[0].slug }/${ song.slug }` }><ExternalLink
                                className="h-4 w-4"/></Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Open Page</TooltipContent>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
}
