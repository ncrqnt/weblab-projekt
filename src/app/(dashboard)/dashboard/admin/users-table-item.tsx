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
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import UserForm from "@/app/(dashboard)/dashboard/admin/user-form";

function deleteUser(id: string) {
    try {
        // void deleteItem(id);
        toast.success("Song deleted successfully.");
    } catch (error: any) {
        toast.error("Failed to delete song.", error.message);
    }
}

export function UsersTableItem({ user, currentUser }: { user: UserItem, currentUser: string }) {
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
                <Dialog>
                    <DialogTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <Edit className="h-4 w-4"/>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>
                                Make changes to the user <code>{ user.name }</code> here.
                            </DialogDescription>
                        </DialogHeader>
                        <UserForm user={user} edit={true} />
                    </DialogContent>
                </Dialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                            className="hover:bg-destructive"
                            disabled={user.id === currentUser}
                        >
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    </AlertDialogTrigger>
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
                </AlertDialog>
            </TableCell>
        </TableRow>
    );
}
