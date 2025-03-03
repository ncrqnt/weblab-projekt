'use client';

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type UserItem } from "@/lib/types";
import { UsersTableItem } from "@/app/(dashboard)/dashboard/admin/users-table-item";

export function UsersTable({ users, currentUser }: { users: UserItem[], currentUser: string }) {

    return (
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
    )
}