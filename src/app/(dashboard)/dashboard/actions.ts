'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from "@/utils/supabase/server";

export async function deleteItem(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('songs').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/dashboard');
}