import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { UsersTable } from "@/app/(dashboard)/dashboard/admin/users-table";
import { type UserItem } from "@/lib/types";

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
        <UsersTable users={ tableData } currentUser={ user!.id }/>
    );
}
