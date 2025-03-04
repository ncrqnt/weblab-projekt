'use client';

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type UserItem } from "@/lib/types";
import { UsersTableItem } from "@/app/(dashboard)/dashboard/admin/users-table-item";
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
import UserForm from "@/app/(dashboard)/dashboard/admin/user-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export function UsersTable({ users, currentUser }: { users: UserItem[], currentUser: string }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="flex items-center mb-2">
                <div className="ml-auto flex items-center gap-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-8 gap-1" asChild>
                                <Link href="#"><PlusCircle className="h-3.5 w-3.5"/>Add User</Link>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add new user</DialogTitle>
                                <DialogDescription>
                                    Create a new user.
                                </DialogDescription>
                            </DialogHeader>
                            <UserForm edit={false} setOpen={setOpen} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>List of all users</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="hidden md:table-cell">E-Mail</TableHead>
                                <TableHead className="hidden md:table-cell">Created&nbsp;by</TableHead>
                                <TableHead className="hidden md:table-cell">Created&nbsp;at</TableHead>
                                <TableHead className="w-fit">
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { users.map((user) => (
                                <UsersTableItem key={ user.id } user={ user } currentUser={ currentUser }/>
                            )) }
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Showing { ' ' } <strong>{ users.length }</strong> users
                    </div>
                </CardFooter>
            </Card>
        </>
    )
}