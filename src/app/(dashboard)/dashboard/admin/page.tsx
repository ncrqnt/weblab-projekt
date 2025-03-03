import { createClient } from "@/utils/supabase/server";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/utils/supabase/admin";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { UsersTable } from "@/app/(dashboard)/dashboard/admin/users-table";
import { type UserItem } from "@/lib/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import UserForm from "@/app/(dashboard)/dashboard/admin/user-form";

const ROLE_LABELS: Record<string, string> = {
    admin: "Admin",
    manager: "Manager",
    user: "User",
}

export default async function AdminPage() {
    const supabase = await createClient();
    const supabaseAdmin = await createAdminClient();

    // Get session data
    const { data: { user } } = await supabase.auth.getUser();

    // Query data
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    const { data: userData, error: userError } = await supabase.from('users_data_light').select('*');

    if (authError) {
        return <p className="text-red-500">Failed to fetch users: { authError.message }</p>
    }

    if (userError) {
        return <p className="text-red-500">Failed to fetch user data: { userError.message }</p>
    }

    const emailLookup = new Map(authData.users.map(user => [user.id, user.email]));

    const tableData: UserItem[] = userData.map((user) => ({
        id: user.id,
        name: user.user_name,
        role: {
            label: ROLE_LABELS[user.role] || user.role,
            value: user.role,
        },
        created_at: user.created_at,
        email: emailLookup.get(user.id) || "N/A",
        created_by: {
            id: user.created_by.id,
            name: user.created_by.name,
        },
        inAuth: emailLookup.has(user.id),
    }));

    return (
        <>
            <div className="flex items-center mb-2">
                <div className="ml-auto flex items-center gap-2">
                    <Dialog>
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
                            <UserForm edit={false} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>List of all users</CardDescription>
                </CardHeader>
                <CardContent><UsersTable users={ tableData } currentUser={ user!.id }/></CardContent>
                <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Showing { ' ' } <strong>{ tableData.length }</strong> users
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}
