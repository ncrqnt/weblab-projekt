'use server';

import { createClient } from "@/utils/supabase/server";

export async function deleteArtistById(id: string) {
    const supabase = await createClient();

    try {
        await supabase.from('artists').delete().eq('id', id);
    }
    catch (error: any) {
        throw new Error(error);
    }
}