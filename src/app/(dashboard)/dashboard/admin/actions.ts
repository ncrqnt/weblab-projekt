'use server';

import { createAdminClient } from "@/utils/supabase/admin";
import { userSchema } from "@/app/(dashboard)/dashboard/admin/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { UserItem } from "@/lib/types";

export async function updateUser(user: UserItem, values: z.infer<ReturnType<typeof userSchema>>) {
    const supabaseAdmin = await createAdminClient();

    const updateData: Record<string, string> = {
        ...(user.email !== values.email ? { email: values.email } : {}),
        ...(values.password ? { password: values.password } : {}),
    };

    if (Object.keys(updateData).length === 0) {
        return { data: null, error: null };
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user.id, updateData);

    revalidatePath("/dashboard/admin");
    return { data: data, error: error };
}

export async function createUser(values: z.infer<ReturnType<typeof userSchema>>) {
    const supabaseAdmin = await createAdminClient();

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: values.email,
        password: values.password,
        email_confirm: true,
    });

    revalidatePath("/dashboard/admin");
    return { data: data, error: error };
}

export async function deleteUserById(id: string) {
    const supabaseAdmin = await createAdminClient();

    try {
        await supabaseAdmin.auth.admin.deleteUser(id);
    }
    catch (error: any) {
        throw new Error(error);
    }
}