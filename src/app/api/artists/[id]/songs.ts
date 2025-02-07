import { supabase } from "@/lib/supabase";

export async function GET(req, { params }) {
    const { data, error } = await supabase
        .from("songs")
        .select("*")
        .eq("artist_id", params.id);
    return Response.json({ data, error });
}
