import { Button } from '@/components/ui/button';
import { Edit, ExternalLink, Trash2 } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { ArtistItem } from "@/lib/types";
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
import Image from "next/image";
import { deleteArtistById } from "@/app/(dashboard)/dashboard/artists/actions";
import Link from "next/link";

export function Artist({ artist, currentUser }: { artist: ArtistItem, currentUser: string }) {

    function deleteArtist(id: string) {
        try {
            void deleteArtistById(id);

            toast.success("Artist deleted successfully.");
        } catch (error: any) {
            toast.error("Failed to delete artist.", error.message);
        }
    }

    return (
        <TableRow>
            <TableCell className="hidden sm:table-cell">
                <Image
                    alt="Cover image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={ artist.profile_picture ?? '/placeholder_person.png' }
                    width="64"
                />
            </TableCell>
            <TableCell className="font-medium">{ artist.name }</TableCell>
            <TableCell className="hidden md:table-cell">{ artist.created_by.name }</TableCell>
            <TableCell className="hidden md:table-cell">
                { artist.created_at ? new Date(artist.created_at).toLocaleDateString("de-CH", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                }) : 'N/A' }
            </TableCell>
            <TableCell className="text-right w-auto">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <Link href={ `/dashboard/artists/${ artist.id }` }><Edit className="h-4 w-4"/></Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                </Tooltip>
                <AlertDialog>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                                <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                    className="hover:bg-destructive"
                                    disabled={ artist.id === currentUser }
                                >
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete '{ artist.name }'</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the artist from the
                                    server.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction variant="destructive"
                                                   onClick={ () => deleteArtist(artist.id) }>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </Tooltip>
                </AlertDialog>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button aria-haspopup="false" size="icon" variant="ghost">
                            <Link href={ `/${ artist.slug }` } target="_blank"><ExternalLink
                                className="h-4 w-4"/></Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Open Page</TooltipContent>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
}
