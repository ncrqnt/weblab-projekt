import { supabase } from "@/lib/supabase";

export async function POST(req) {
    const body = await req.json();
    const {data, error} = await supabase.from("songs").insert([body]);
    return Response.json({data, error});
}