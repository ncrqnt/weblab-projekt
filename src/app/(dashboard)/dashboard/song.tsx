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
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Tables } from "@/lib/db.types";

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
            <TableCell>
                {song.artists.map((artist: string, index: number) => (
                    <Badge key={index} variant="outline" className="capitalize text-center">
                        { artist }
                    </Badge>
                ))}
            </TableCell>
            <TableCell className="hidden md:table-cell">{ song.album }</TableCell>
            <TableCell className="hidden md:table-cell">{ song.created_by }</TableCell>
            <TableCell className="hidden md:table-cell">
                { song.created_at ? new Date(song.created_at).toLocaleDateString("de-CH", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                }) : 'N/A' }
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4"/>
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>
                            <form action="">
                                <button type="submit">Delete</button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
