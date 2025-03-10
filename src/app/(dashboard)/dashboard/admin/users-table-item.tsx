import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { UserItem } from "@/lib/types";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import UserForm from "@/app/(dashboard)/dashboard/admin/user-form";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { deleteUserById } from "@/app/(dashboard)/dashboard/admin/actions";

export function UsersTableItem({ user, currentUser }: { user: UserItem, currentUser: string }) {
    const [open, setOpen] = useState(false);

    function deleteUser(id: string) {
        try {
            void deleteUserById(id);
            toast.success("Song deleted successfully.");
        } catch (error: any) {
            toast.error("Failed to delete song.", error.message);
        }
    }

    return (
        <TableRow>
            <TableCell className="font-medium">{ user.name }</TableCell>
            <TableCell className="">{ user.role.label }</TableCell>
            <TableCell className="hidden md:table-cell">{ user.email }</TableCell>
            <TableCell className="hidden md:table-cell">{ user.created_by.name }</TableCell>
            <TableCell className="hidden md:table-cell">
                { user.created_at ? new Date(user.created_at).toLocaleDateString("de-CH", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                }) : 'N/A' }
            </TableCell>
            <TableCell className="text-right w-auto">
                <Dialog open={ open } onOpenChange={ setOpen }>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <Edit className="h-4 w-4"/>
                                </Button>
                            </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                                <DialogDescription>
                                    Make changes to the user <code>{ user.name }</code> here.
                                </DialogDescription>
                            </DialogHeader>
                            <UserForm user={ user } edit={ true } setOpen={ setOpen }/>
                        </DialogContent>
                    </Tooltip>
                </Dialog>
                <AlertDialog>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                            <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                                className="hover:bg-destructive"
                                disabled={ user.id === currentUser }
                            >
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete '{ user.name }'</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the user from the server.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction variant="destructive"
                                                   onClick={ () => deleteUser(user.id) }>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </Tooltip>
                </AlertDialog>
            </TableCell>
        </TableRow>
    );
}
