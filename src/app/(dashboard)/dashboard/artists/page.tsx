import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ArtistItem } from "@/lib/types";
import { ArtistsTable } from "@/app/(dashboard)/dashboard/artists/artists-table";

export default async function ArtistsPage() {
    const supabase = await createClient();

    // Get session data
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/sign-in`);
    }

    const { data: userData, error: userError } = await supabase.from('users').select('id, user_name, role').eq("id", user.id).single();
    if (userError) return <p className="text-red-500">Failed to load user data: { userError.message }</p>;

    // Query data
    const { data, error } = await supabase
        .from('artists_data')
        .select('*')
        .order("name", { ascending: true }
        );


    if (error) return <p className="text-red-500">Failed to load songs: { error.message }</p>;

    // Map data
    const tableData: ArtistItem[] = data;

    return (
        <ArtistsTable artists={ tableData } currentUser={ userData }/>
    );
}
